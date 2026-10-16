// Non-production configuration, scoped to the isolated Neon branch.
// This is a public endpoint, not a secret; NO production customer auth is enabled.
window.MUSCLE_MAP_ACCOUNT_CONFIG = Object.freeze({
    stage: 'staging',
    authUrl: 'https://ep-summer-recipe-b1qi9f29.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth',
    apiUrl: 'https://muscle-map-backend-staging.onrender.com', // standalone staging server, never production
    emailVerificationRequired: true, // OTP is required on the isolated Neon Auth staging branch
    enableBackendPremium: true
});
