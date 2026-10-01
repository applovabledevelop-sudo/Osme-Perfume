import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  increment,
  runTransaction
} from 'firebase/firestore';
import fs from 'fs';
import { INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_SETTINGS, INITIAL_COUPONS, INITIAL_REVIEWS, INITIAL_BLOG_POSTS } from './src/services/seedData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config
const firebaseConfigPath = path.resolve(__dirname, 'firebase-applet-config.json');
let firebaseConfig: any = {};
if (fs.existsSync(firebaseConfigPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  } catch (e) {
    console.error('Failed to parse firebase-applet-config.json', e);
  }
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const BOOTSTRAP_ADMIN_EMAIL = 'applovabledevelop@gmail.com';

async function seedDatabaseIfEmpty() {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (!settingsDoc.exists()) {
      console.log('Seeding initial Luxora database collections...');
      // 1. Settings
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);

      // 2. Collections
      for (const col of INITIAL_COLLECTIONS) {
        await setDoc(doc(db, 'collections', col.id), col);
      }

      // 3. Products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }

      // 4. Coupons
      for (const coup of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', coup.code), coup);
      }

      // 5. Reviews
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), rev);
      }

      // 6. Blog Posts
      for (const post of INITIAL_BLOG_POSTS) {
        await setDoc(doc(db, 'blogPosts', post.id), post);
      }

      // 7. Seed Admin Record for applovabledevelop@gmail.com
      await setDoc(doc(db, 'admins', 'superadmin_default'), {
        email: BOOTSTRAP_ADMIN_EMAIL,
        role: 'superadmin',
        displayName: 'Luxora Atelier Super Admin',
        createdAt: new Date().toISOString(),
      });

      console.log('Database seeding successfully finished.');
    }
  } catch (err) {
    console.warn('Database seed check warning (will proceed):', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Seed on startup
  seedDatabaseIfEmpty();

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Luxora Perfumes API',
      timestamp: new Date().toISOString(),
    });
  });

  // Manual seed endpoint
  app.post('/api/seed', async (_req: Request, res: Response) => {
    try {
      await seedDatabaseIfEmpty();
      res.json({ success: true, message: 'Database verified / seeded.' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Cart calculation and validation
  app.post('/api/cart/validate', async (req: Request, res: Response) => {
    try {
      const { items, couponCode, shippingMethod } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.json({
          valid: true,
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          items: [],
        });
      }

      // Validate prices and stock
      let subtotal = 0;
      const validatedItems: any[] = [];

      for (const item of items) {
        let price = item.price || 0;
        let stock = 100;

        try {
          const prodSnap = await getDoc(doc(db, 'products', item.productId));
          if (prodSnap.exists()) {
            const prodData = prodSnap.data();
            if (item.size && Array.isArray(prodData.variants)) {
              const matchedVar = prodData.variants.find((v: any) => v.size === item.size);
              if (matchedVar) {
                price = Number(matchedVar.price);
                stock = Number(matchedVar.stock);
              } else {
                price = Number(prodData.price);
                stock = Number(prodData.stock);
              }
            } else {
              price = Number(prodData.price);
              stock = Number(prodData.stock);
            }
          }
        } catch {
          // If Firestore query fails, use client submitted price safely
        }

        const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, stock));
        subtotal += price * quantity;
        validatedItems.push({
          ...item,
          price,
          quantity,
          maxStock: stock,
        });
      }

      // Coupon calculation
      let discount = 0;
      let appliedCoupon: any = null;

      if (couponCode) {
        const cleanCode = String(couponCode).trim().toUpperCase();
        let cData: any = null;
        try {
          const couponSnap = await getDoc(doc(db, 'coupons', cleanCode));
          if (couponSnap.exists()) {
            cData = couponSnap.data();
          }
        } catch (err) {
          console.warn('Coupon lookup warning:', err);
        }

        if (!cData) {
          cData = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
        }

        if (cData && cData.active) {
          const minOrder = Number(cData.minOrder) || 0;
          if (subtotal >= minOrder) {
            if (cData.type === 'percentage') {
              discount = (subtotal * Number(cData.amount)) / 100;
              if (cData.maxDiscount && discount > Number(cData.maxDiscount)) {
                discount = Number(cData.maxDiscount);
              }
            } else if (cData.type === 'fixed') {
              discount = Math.min(subtotal, Number(cData.amount));
            }
            appliedCoupon = {
              code: cleanCode,
              type: cData.type,
              amount: cData.amount,
              discountAmount: discount,
            };
          }
        }
      }

      // Shipping calculation ($75 free shipping threshold)
      const freeShippingThreshold = 75;
      let shipping = 0;
      if (shippingMethod === 'express') {
        shipping = 18.0;
      } else {
        shipping = subtotal >= freeShippingThreshold ? 0 : 8.0;
      }

      const taxableAmount = Math.max(0, subtotal - discount);
      const tax = Math.round(taxableAmount * 0.04 * 100) / 100; // 4% luxury fragrance tax
      const total = Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);

      res.json({
        valid: true,
        items: validatedItems,
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        shipping,
        tax,
        total,
        appliedCoupon,
      });
    } catch (e: any) {
      console.error('Error in /api/cart/validate:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Secure Server-side Checkout
  app.post('/api/orders/checkout', async (req: Request, res: Response) => {
    try {
      const {
        items,
        shippingAddress,
        customerEmail,
        customerName,
        customerPhone,
        shippingMethod,
        paymentMethod,
        couponCode,
        userId,
        notes,
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      if (!shippingAddress || !customerEmail || !customerName) {
        return res.status(400).json({ error: 'Missing required customer or shipping details' });
      }

      // Server recalculation
      let subtotal = 0;
      const orderItems: any[] = [];

      for (const item of items) {
        let price = Number(item.price);
        try {
          const pDoc = await getDoc(doc(db, 'products', item.productId));
          if (pDoc.exists()) {
            const p = pDoc.data();
            if (item.size && Array.isArray(p.variants)) {
              const v = p.variants.find((vr: any) => vr.size === item.size);
              if (v) price = Number(v.price);
            } else {
              price = Number(p.price);
            }
          }
        } catch {}

        const qty = Number(item.quantity) || 1;
        subtotal += price * qty;
        orderItems.push({
          productId: item.productId,
          name: item.name,
          slug: item.slug || item.productId,
          image: item.image || '/images/hero_perfume.jpg',
          size: item.size || '50ml',
          sku: item.sku || 'LUX-GEN',
          price,
          quantity: qty,
        });
      }

      // Coupon verification
      let discount = 0;
      if (couponCode) {
        const cleanCode = String(couponCode).trim().toUpperCase();
        let c: any = null;
        try {
          const cDoc = await getDoc(doc(db, 'coupons', cleanCode));
          if (cDoc.exists() && cDoc.data().active) {
            c = cDoc.data();
          }
        } catch {}

        if (!c) {
          c = INITIAL_COUPONS.find((cp) => cp.code.toUpperCase() === cleanCode);
        }

        if (c && c.active) {
          if (c.type === 'percentage') {
            discount = (subtotal * Number(c.amount)) / 100;
            if (c.maxDiscount) discount = Math.min(discount, Number(c.maxDiscount));
          } else {
            discount = Math.min(subtotal, Number(c.amount));
          }
        }
      }

      const shipping = shippingMethod === 'express' ? 18.0 : (subtotal >= 75 ? 0 : 8.0);
      const taxableAmount = Math.max(0, subtotal - discount);
      const tax = Math.round(taxableAmount * 0.04 * 100) / 100;
      const total = Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);

      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = `LUX-2026-${randomSuffix}`;
      const orderId = `ord_${Date.now()}_${randomSuffix}`;

      const newOrder = {
        id: orderId,
        orderNumber,
        userId: userId || null,
        customerEmail: String(customerEmail).trim().toLowerCase(),
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone || '').trim(),
        items: orderItems,
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        shipping,
        tax,
        total,
        couponCode: couponCode || null,
        shippingAddress,
        shippingMethod: shippingMethod || 'Standard Delivery',
        paymentMethod: paymentMethod || 'Online Luxury Gateway',
        paymentStatus: 'paid',
        status: 'confirmed',
        trackingNumber: `TRK-LX-${Math.floor(10000000 + Math.random() * 90000000)}`,
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save order to Firestore
      await setDoc(doc(db, 'orders', orderId), newOrder);

      // Decrement product stock safely
      for (const it of orderItems) {
        try {
          await updateDoc(doc(db, 'products', it.productId), {
            stock: increment(-it.quantity),
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn(`Could not decrement stock for ${it.productId}:`, e);
        }
      }

      res.status(201).json({
        success: true,
        order: newOrder,
      });
    } catch (e: any) {
      console.error('Error during checkout:', e);
      res.status(500).json({ error: e.message || 'Checkout failed' });
    }
  });

  // Admin Check / Bootstrap
  app.get('/api/admin/role-check', async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!email) return res.json({ isAdmin: false, role: 'guest' });

    if (email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
      return res.json({ isAdmin: true, role: 'superadmin' });
    }

    try {
      const adminDocs = await getDocs(collection(db, 'admins'));
      let foundRole: string | null = null;
      adminDocs.forEach(d => {
        const data = d.data();
        if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
          foundRole = data.role || 'admin';
        }
      });

      if (foundRole) {
        return res.json({ isAdmin: true, role: foundRole });
      }
    } catch {}

    res.json({ isAdmin: false, role: 'customer' });
  });

  // Production vs Dev Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Luxora Perfumes Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
