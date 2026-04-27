# Duality

Duality is a white-and-yellow storefront for meme shirts, sports merch, anime merch, and intentionally unwearable joke tees. The site combines a brand-led homepage, a category-based catalog, customer accounts, Razorpay checkout, Neon Postgres, and optional Printful fulfillment hooks.

## What is inside

- White/yellow storefront built for mobile and desktop
- Filterable catalog and product detail pages
- Store categories for meme shirts, sports merch, and anime merch
- Customer accounts with email/password, Google, and Microsoft sign-in
- Persistent cart with a 5-tee order cap
- Hosted Neon Postgres database support
- Razorpay order creation, client checkout, and payment verification
- Razorpay webhook route for post-payment automation
- Printful fulfillment route with env-based variant mapping
- Custom joke-shirt request flow
- Production notes in [`docs/architecture.md`](./docs/architecture.md)

## Run locally

```bash
npm install
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

## Database setup

Create a free Neon Postgres project and copy both connection strings:

- `DATABASE_URL`: use the pooled connection string for the app runtime.
- `DIRECT_URL`: use the direct connection string for migrations.

If the Neon Vercel integration gives you `DATABASE_URL_UNPOOLED`, copy that same value into `DIRECT_URL`.

Then run:

```bash
npm run db:setup
```

For schema changes during development, use:

```bash
npm run db:migrate
```

## Environment setup

Copy `.env.example` to `.env.local` and fill in your provider credentials.

Core auth and checkout expects:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AZURE_AD_CLIENT_ID`
- `AZURE_AD_CLIENT_SECRET`
- `AZURE_AD_TENANT_ID`

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `PRINTFUL_API_TOKEN`
- `PRINTFUL_VARIANT_MAP`

`npm run db:setup` applies the Prisma migrations to your hosted Postgres database and regenerates the Prisma client.

If you want to launch payment first and handle fulfillment manually, set `ALLOW_MANUAL_FULFILLMENT=true`.

## Scripts

- `npm run db:generate` regenerates the Prisma client
- `npm run db:migrate` creates and applies development migrations
- `npm run db:setup` applies migrations to the hosted database and regenerates Prisma
- `npm run db:studio` opens Prisma Studio
- `npm run dev` starts the local development server
- `npm run build` builds the app for production
- `npm run lint` runs ESLint
