# NUR Revenue Sprint — Founding Orbit

## Product

The first monetizable surface is a free, private, three-minute **Orbit Scan** at:

```text
/orbit-scan
```

The scan creates one useful movement immediately, then offers durable NUR continuity.

## Paid offer

**Founding Orbit — $99/year for the first 50 members.**

The offer promises:

- a durable private Orbit;
- Talk → Journal → Plan continuity;
- founding price locked for year one.

Do not promise unlimited AI access or features that are not live.

## Checkout activation

The result screen reads this frontend environment variable:

```bash
VITE_FOUNDING_ORBIT_CHECKOUT_URL=https://YOUR-STORE.lemonsqueezy.com/buy/YOUR-CHECKOUT-ID
```

Until the checkout URL exists, the paid CTA opens a pre-filled email to:

```bash
VITE_FOUNDING_ORBIT_CONTACT_EMAIL=am.statementforge@gmail.com
```

The fallback is intentionally truthful: it requests a secure payment link and does not pretend checkout is connected.

## Local verification

```bash
npm install
npm run web:typecheck
npm run web:build
npm --workspace apps/web run dev
```

Open:

```text
http://localhost:5173/orbit-scan
```

Verify all five directions and all five friction paths, mobile layout, free-Orbit link, email fallback, and the real Lemon Squeezy checkout after the environment variable is configured.

## Revenue activation checklist

1. Create a Lemon Squeezy product named `NUR Founding Orbit`.
2. Set the price to `$99/year` and limit/retire the offer after 50 customers.
3. Put the generated checkout URL in `VITE_FOUNDING_ORBIT_CHECKOUT_URL` on the deployed web environment.
4. Deploy this branch.
5. Send traffic directly to `/orbit-scan`, not the generic homepage.
6. Measure scan starts, scan completions, checkout clicks, and purchases before adding more features.
