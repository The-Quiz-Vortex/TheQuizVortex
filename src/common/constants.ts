import { StripeElementsOptions } from "@stripe/stripe-js";

export const NOW_IN_MS = new Date().getTime();
export const OPEN_AI_API_KEY = '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';

export const STRIPE_BASE_URL = "https://api.stripe.com";
export const API_KEY_STRIPE_SECRET = "sk_test_51NmuUCABd5PPGEviCm8aFFxdo4K12X13Eq1d086VkM8LMxr0FixDJ9knnsCBR7quC0CEGp1feF4AGzeNl1hz80OI00D51Wbufu";
export const API_KEY_STRIPE_PUBLISHABLE = "pk_test_51NmuUCABd5PPGEviIvZXmXAdHoqXjIHeLcCLuS3U0qBGrao1DjcTjOcraF9x8tKZUImkrGKQ4emf3puRX1mNdunx00LNsiF5lu";
export const paymentOptions: StripeElementsOptions = {
    mode: 'subscription',
    amount: 1099,
    currency: 'usd',
    // Fully customizable with appearance API.
    appearance: {/*...*/ },
};
