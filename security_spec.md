# Security Spec: Luxora Perfumes

## 1. Data Invariants
- Public users can read active products, active collections, approved reviews, published blog posts, and site settings.
- Only authenticated customers can read/write their own orders (`order.userId == request.auth.uid` or matching email for guest lookup), profile, and reviews.
- Reviews can only be created by signed-in users with their own `userId == request.auth.uid`, with rating between 1 and 5.
- Orders cannot be tampered with or modified by unprivileged users once placed.
- Only administrators (verified email `applovabledevelop@gmail.com` or listed in `/admins/{uid}`) can create/update/delete products, collections, coupons, settings, and update order statuses.
- Contact messages and newsletter subscriptions can be submitted with rate limiting / validation checks and can only be read/managed by admins.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Ghost Admin Promotion**: An unauthenticated user writing to `/admins/attacker` with `{ "role": "superadmin" }`. Expected: PERMISSION_DENIED.
2. **Product Price Override via Client**: An attacker attempting `update` on `/products/p1` with `{ "price": 0.01 }`. Expected: PERMISSION_DENIED.
3. **Impersonate Order Owner**: User B attempting `get` on `/orders/order123` belonging to User A. Expected: PERMISSION_DENIED.
4. **Order Status Hijack**: Customer attempting `update` on `/orders/order123` with `{ "status": "delivered", "paymentStatus": "paid" }`. Expected: PERMISSION_DENIED.
5. **Review Spoofing**: User A attempting to post a review with `userId: "user_B"`. Expected: PERMISSION_DENIED.
6. **Denial of Wallet Huge Payload**: An attacker posting a contact message with a 50MB string. Expected: PERMISSION_DENIED.
7. **Coupon Self-Issuance**: A customer attempting to write a new 100% off coupon into `/coupons/FREEALL`. Expected: PERMISSION_DENIED.
8. **Setting Vandalism**: Public user updating `/settings/general` to change site logo and name. Expected: PERMISSION_DENIED.
9. **Unverified Email Spoof**: Attacker with unverified email setting `request.auth.token.email = 'applovabledevelop@gmail.com'` without `email_verified == true`. Expected: PERMISSION_DENIED.
10. **ID Poisoning Attack**: An attacker attempting document operations with 2KB special character ID. Expected: PERMISSION_DENIED.
11. **Negative Price/Stock Injection**: Creating a product with `price: -50` or `stock: -100`. Expected: PERMISSION_DENIED.
12. **Newsletter Scraping**: An unauthenticated user attempting `list` on `/newsletterSubscribers`. Expected: PERMISSION_DENIED.
