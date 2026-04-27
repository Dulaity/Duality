# Duality Architecture

## Product goal

Build one website that does three jobs well:

1. Present Duality as a playful meme-shirt brand.
2. Let people browse and buy meme shirts, sports merch, and anime merch.
3. Support secure payments and a realistic fulfillment path for India.

## Recommended stack

| Layer | Recommendation | Why |
| --- | --- | --- |
| Frontend | Next.js App Router + React + Tailwind CSS | Fast rendering, flexible layout control, and a strong fit for polished storefront work |
| Catalog data | Prisma with Neon Postgres | Free hosted Postgres is safer for deployment than SQLite and works well with Vercel/serverless runtimes |
| Payments | Razorpay Standard Checkout + Razorpay webhooks | Better fit for an India-based business, with UPI, cards, netbanking, and webhook-driven order automation |
| Fulfillment | Printful or a local print partner | Lets the team launch without large inventory commitments |
| Media uploads | Cloudinary signed uploads | Useful for mockups, product art, and future customer-uploaded references |
| Rate limiting | Upstash Redis | Protects checkout, admin, and custom-order routes |
| Hosting | Vercel | Best fit with the current Next.js setup |

## Production flow

### Browse and cart

- Product content is rendered through the Next.js storefront.
- Store filtering is organized around meme shirts, sports merch, and anime merch.
- Cart state lives client-side for speed and convenience.
- Prices and totals are never trusted from the browser.

### Customer accounts

- Customer accounts are optional, so shoppers can still discover the catalog without friction.
- Email and password accounts are stored in Neon Postgres through Prisma with salted password hashes.
- Google and Microsoft OAuth are handled through Auth.js with provider callbacks and secure cookies.
- Signed-in customers get faster checkout through prefilled name and email details.

### Checkout

- The cart page collects delivery details before payment starts.
- The frontend sends only cart line items plus shipping details.
- A server route rebuilds totals from the trusted catalog.
- A single checkout is capped at 5 tees total.
- Razorpay creates an order on the server and returns a secure order id for the checkout popup.
- After payment, the signature is verified server-side and automation runs from webhooks.

### Fulfillment

- `payment.captured` webhook events trigger the fulfillment flow.
- Product-to-Printful variant mapping is supplied through `PRINTFUL_VARIANT_MAP`.
- `external_id` is set from the Duality order code to keep retries idempotent.
- If Printful is not configured, the system can fall back to manual fulfillment.

## Security model

### Application security

- Use strict security headers across the app.
- Keep secrets only in environment variables.
- Validate every write request with Zod.
- Hash customer passwords before storage and never log raw credentials.
- Recompute totals on the server before checkout.
- Verify Razorpay payment signatures and webhook signatures.
- Verify Printful webhook signatures before accepting updates.
- Keep account sessions server-validated and protect account routes with server redirects.
- Use the pooled Neon `DATABASE_URL` for app runtime and the direct Neon `DIRECT_URL` for migrations.

### Access control

- Keep accounts optional so checkout stays lightweight for first-time shoppers.
- Support email/password plus Google and Microsoft sign-in for customer convenience.
- Add a protected admin dashboard only when you start managing products and orders from the database.
- Keep any future admin actions behind role-based access and audit logs.

### Abuse prevention

- Rate-limit checkout and custom-order endpoints.
- Add bot protection only if abuse appears.
- Monitor failed validations, webhook errors, and unusual order spikes.

## Deployment checklist

- Configure production environment variables in Vercel.
- Create a free Neon Postgres project and run `npm run db:setup` with `DATABASE_URL` and `DIRECT_URL` set.
- Turn on HTTPS, custom domain, and HSTS.
- Set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and OAuth provider callback URLs correctly for production.
- Set up the Razorpay webhook endpoint for `payment.captured`.
- Fill `PRINTFUL_VARIANT_MAP` with real variant ids for every size.
- Keep uploaded assets in signed or authenticated storage only.
- Keep `DATABASE_URL` and `DIRECT_URL` in Vercel environment variables, never in source control.

## Suggested roadmap

1. Use the current storefront for demos, user testing, and early sales validation.
2. Add a database-backed admin panel for products, orders, and custom joke requests.
3. Connect email notifications for payment, production, and dispatch updates.
4. Replace Printful with a local print workflow if your margins improve with local production.
5. Add analytics and launch pages for future releases.
