# Luxora Perfumes — Haute Parfumerie Full-Stack E-Commerce

Luxora Perfumes is an artisanal luxury perfume e-commerce web application inspired by high-end fragrance boutiques. It combines an ivory and cream aesthetic with champagne gold accents, rich serif typography, and a full-stack architecture built on React, TypeScript, Express, and Firebase (Firestore & Authentication).

---

## 🌟 Key Features

### 1. Storefront & Customer Experience
- **Luxury Editorial Layout**: Warm ivory (`#FAF7F2`), deep charcoal (`#141312`), and champagne gold accents (`#C5A059`) with Cormorant Garamond typography.
- **Hero Showcase**: High-resolution perfume flacon presentation, "NEW ARRIVAL / Discover Now" badge, and three key feature highlights (*Premium Quality*, *Long Lasting*, *Beautiful Gifting*).
- **Benefits Bar**: Free shipping over $75, 30-day return policy, 100% secure payment, dedicated concierge support.
- **Shop by Scent**: Collections organized by olfactory families: *Floral*, *Oud*, *Fresh*, *Oriental*, and *Woody*.
- **Customer Favorites (Best Sellers)**: Dark luxury section highlighting iconic fragrances (*Noir Intense*, *Bloom Essence*, *Aqua Fresh*, *Royal Oud*).
- **The Scent Pyramid**: Visual breakdown of Top Notes (0–30 min), Heart Notes (30 min–4 hrs), and Base Notes (4–16+ hrs).
- **Product Detail Page**:
  - Image gallery with zoom inspection and fullscreen lightbox modal.
  - Flacon size selector (30ml, 50ml, 100ml) with dynamic price calculation and stock limits.
  - Direct "Add to Shopping Bag", "Buy Now", and Wishlist controls.
  - Scent pyramid breakdown, formulation & ingredients list, shipping guarantees.
  - Verified customer reviews with star rating submission.
- **Global Search**: Search fragrances by name, SKU, collection, or aromatic notes with instant autocomplete suggestions.
- **Shopping Bag & Slide-out Cart Drawer**:
  - Free delivery progress meter ($75 threshold).
  - Promo voucher validation (`WELCOME10` for 10% off, `LUXURY20` for 20% off).
  - Live quantity adjustment, item removal, and subtotal/tax computation.
- **Multi-Step Checkout**:
  - Customer Credentials & Shipping Address.
  - Courier Delivery Options (Standard Free over $75 vs Express White-Glove).
  - Payment Gateway (Online Luxury Gateway with card simulation or Cash on Delivery).
  - Server-side calculation, unique order number generation (`LUX-2026-XXXXXX`), and confetti celebration.
- **Client Portal**:
  - Order history with tracking status (*Pending*, *Confirmed*, *Processing*, *Shipped*, *Delivered*).
  - Saved Wishlist items with direct move-to-bag.
  - Profile management.
- **Maison Heritage & Editorial**:
  - About Us with brand story, philosophy, craftsmanship, ingredients, and sustainability.
  - The Perfumer’s Journal with editorial essays.
  - Atelier Concierge contact form saving to Firestore `contactMessages`.
  - Privilege Club newsletter subscription with Firestore persistence.

---

### 2. Admin Management Panel (`/admin` and `/admin/login`)
- **Protected Routing & RBAC**:
  - Roles: `superadmin`, `admin`, `staff`.
  - Primary Super Admin bootstrapped for `applovabledevelop@gmail.com`.
- **Admin Dashboard**:
  - Real-time revenue, total orders, customer count, active catalog count, and low stock warnings.
  - Interactive SVG revenue and sales charts.
  - Date filtering: *Today*, *7 Days*, *30 Days*, *90 Days*, *This Year*.
  - Recent orders feed with inline status modifier.
- **Flacon Catalog CRUD (`/admin` -> Products)**:
  - Create, edit, duplicate, activate/deactivate, and delete products.
  - Variant manager (30ml, 50ml, 100ml) with separate prices and stock levels.
  - Image gallery manager and scent notes pyramid editor.
- **Order Management (`/admin` -> Orders)**:
  - Filter orders by status (*Pending*, *Confirmed*, *Processing*, *Shipped*, *Delivered*, *Cancelled*, *Refunded*).
  - Full order dossier inspection with customer address, tracking numbers, and line items.
- **Patron Register (`/admin` -> Customers)**:
  - View client spending totals, order history, and account tier.
- **Collection Taxonomy (`/admin` -> Collections)**:
  - Add, edit, and delete fragrance collection cards with images and descriptions.
- **Promotional Vouchers (`/admin` -> Coupons)**:
  - Configure percentage or fixed discounts, minimum spend, expiry date, and usage limits.
- **Review Moderation (`/admin` -> Reviews)**:
  - Approve, hide, or delete customer fragrance evaluations.
- **Journal Publications (`/admin` -> Blog)**:
  - Compose, edit, and publish editorial essays.
- **Client Inquiries (`/admin` -> Messages)**:
  - Inbox for contact form correspondence.
- **Newsletter Subscribers (`/admin` -> Newsletter)**:
  - View subscriber timestamps and export to CSV.
- **Live Website Customization (`/admin` -> Website Settings)**:
  - Live editable without modifying code:
    - General brand name, tagline, currency, contact email, phone, address.
    - Homepage hero titles, description, buttons, badge, feature cards.
    - Header announcement bar and discounts.
    - Footer brand description, links, and copyright text.
    - Social media URLs (Instagram, Facebook, TikTok, YouTube, Pinterest, Twitter).
    - Policy charters (Privacy, Terms, Shipping, Returns).
- **Staff Access (`/admin` -> Users)**:
  - Manage RBAC authorization for secondary atelier team members.

---

### 3. Server-Side Architecture
- **Express Backend**: Mounted seamlessly with Vite middleware in development and static bundle serving in production.
- **Server-Side Verification**:
  - `POST /api/cart/validate`: Recalculates subtotal, applies verified vouchers, evaluates shipping thresholds, and enforces stock maximums.
  - `POST /api/orders/checkout`: Validates order items, computes server-authoritative totals, decrements stock in Firestore, writes the order document, and generates tracking numbers.
  - `POST /api/seed`: Pre-populates the database with default luxury perfumes, collections, vouchers, and settings.
