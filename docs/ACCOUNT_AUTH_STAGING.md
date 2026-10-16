# Account sign-up / sign-in: staged Neon Auth implementation

**Status as of 2026-10-16:** Draft PR #11, not deployed. Frontend main and the production payments backend remain untouched.

## Architecture

- Neon project: `sparkling-sun-97014945`, isolated branch `staging-issue10-auth-20261016` (`br-jolly-sunset-b1pl23nn`).
- The Managed Better Auth service is enabled **only on this Neon staging branch**. A dedicated `neon_auth` schema contains its user and session tables. Registration via email and password is enabled there. Email verification is **not required in staging**, which is unacceptable for automatic paid-account migration in production.
- The public staging Auth URL is in `account-config.js` and can only be used from the branch preview or local server. **It is not a secret.** Secrets and passwords must never be committed.
- `account.html`, `account.css`, `account.js`: desktop/mobile RU/EN account UI. Users can sign up, sign in, restore the session on reload, sign out. All credential entry goes to the managed auth service. No passwords, sessions or JWTs are persisted in localStorage.
- `index.html` has a desktop account link, and `mobile-home.js` exposes Account from the mobile **More** sheet. Only the Draft branch has those changes.
- The frontend is still static HTML/CSS/JS and does **not** switch Premium permissions based on a new Neon login. `enableBackendPremium: false` deliberately prevents calls to the production backend from this staging-only account UI.
- Backend Draft PR #2 adds authenticated endpoints `GET /api/v2/me/premium`, `POST /api/v2/me/checkout` and account binding. It accepts Neon EdDSA JWTs only when `AUTH_PROVIDER=neon`; verify issuer and JWKS corresponding to the **same branch**. That backend code has not been deployed.

## Tests

- Static and syntax checks: `node --check account.js`, `node --test tests/account.test.cjs`.
- Real disposable test account in **staging Neon only**, via GitHub Actions Playwright:
  `node tests/account-browser.cjs` desktop and `MOBILE_ACCOUNT=true node tests/account-browser.cjs` mobile.
- E2E checks email/password signup, successful account view, reload with session, logout, login again, short-lived JWT issuance via `/token`, EdDSA signature/issuer validation against managed JWKS, and zero JavaScript errors.
- Tests use unique `@example.com` addresses on staging, not a real person's email. They create staging auth records; clean those up via Neon staging admin after review as appropriate.

## Production migration gate (not complete)

1. Configure Managed Better Auth for the production Neon branch **only after** staging sign-in is verified, with approved trusted origins, rate limiting and e-mail verification. Use production Auth URL/JWKS, not the staging keys.
2. Deploy a separate isolated test backend configured with the same staging identity provider; verify protected status/checkouts through a real JWT before touching LIVE Dodo.
3. Keep old Premium users working. Current audit: 3 legacy Premium records, **2** with a stored Dodo customer ID, **1** without one. None has been auto-claimed or altered.
4. Verify actual control of the historical Dodo account with independent evidence before invoking the backend's **internal only** `linkLegacyPremiumAfterReview` operation. The mapping change preserves the subscriber's original Premium expiry and has a one-to-one review trail. Never accept localStorage ID, e-mail equality, or a screenshot of a receipt alone.
5. The missing-customer-ID record needs separate signed webhook / Dodo merchant reconciliation first. Do not invent links.
6. Server-side enforcement of paid-only operations, refund/chargeback state transitions, tested migration, email-verified identity, monitored rollout and rollback are still required before closing frontend Issue #10.
7. Keep Render Auto-Deploy **off**. Do not issue a real Dodo charge or change LIVE credentials as part of account staging.

Official reference: https://neon.com/docs/auth and https://github.com/neondatabase/website/blob/main/content/docs/compute/functions/authentication.md


## Email verification work (2026-10-16)

The account page now has an OTP code form and resend control for `/email-otp/send-verification-otp` and `/email-otp/verify-email`. The interface is gated behind `emailVerificationRequired` in `account-config.js`. It remains **false** because the managed Neon Auth staging tenant currently reports `require_email_verification: false` and the connected Neon action can change the displayed application name, but not the separate email/password verification options.

**Required operator action in Neon Console, staging branch only:** Auth → Email & Password → require email verification (OTP) ON, and enable verification messages on sign up/sign in where available. Confirm delivery to a real controlled mailbox and reject bad/expired OTP. Only after the provider reports the new config and actual successful verification tests may we set `emailVerificationRequired: true` on the frontend branch. Never use a made-up OTP or mark `neon_auth.user.emailVerified` by hand in the actual tenant.

The backend Draft PR #2 now supports mandatory `REQUIRE_EMAIL_VERIFICATION=true`, queries `neon_auth.user.emailVerified` after verifying the signed JWT, and rejects unverified users before creating/binding any Premium account or checkout. GitHub Actions runs a disposable PostgreSQL HTTP test with a real Neon JWT but local **fixture** email-verification states. This tests authorization logic only, not genuine mail delivery.

Production Neon Auth, Render backend and Dodo LIVE are unchanged. The connection-string retrieval via connected Neon tool currently returns an authorization failure, so a persistent isolated Render staging instance has not been provisioned. The disposable GitHub Actions backend/DB is the independent API test stand instead.
