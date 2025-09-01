# Home in Every Bite – Next.js Shop (EN/NL/AFR)

Features:
- Multilingual (English, Dutch, Afrikaans) with i18n JSON
- Product grid, category filters, localized search
- Cart + Checkout with Mollie (iDEAL, Apple Pay, Cards)
- Shipping: Pickup (Arnhem, free), PostNL (€5.50), DHL (€5.50); free over €50
- Order confirmation emails (localized) + PDF invoice (localized)
- Invoice numbering: `INV-YYYYMMDD-<MollieID>`
- Invoice log + Admin invoice history with CSV export

## Quick start
```bash
pnpm i
cp .env.example .env.local  # or create .env.local
pnpm dev
```

## Env (.env.local)
```
MOLLIE_API_KEY=live_xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_URL=https://your-domain.com
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=********
FROM_EMAIL="Home in Every Bite <orders@yourdomain.com>"
ORDER_NOTIFY_EMAIL=you@yourdomain.com
```

## Deploy
See deployment guide provided in chat (Vercel recommended).
