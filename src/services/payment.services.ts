import { PaymentIntent, SetupIntent } from "@stripe/stripe-js";
import { stripe } from "../config/stripe-config.ts";

export const createStripeSubscription = async (priceId: string, customerId: string) => {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        });

        if (subscription.pending_setup_intent !== null) {
            return ({
                type: 'setup',
                clientSecret: (subscription.pending_setup_intent as SetupIntent).client_secret,
            });
        } else if (typeof subscription.latest_invoice !== "string") {
            return ({
                type: 'payment',
                clientSecret: ((subscription.latest_invoice)?.payment_intent as PaymentIntent).client_secret,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const cancelStripeSubscription = async (subscriptionId: string) => {
    try {
        const subscription = await stripe.subscriptions.cancel(subscriptionId);
        return subscription.status;
    } catch (error) {
        console.log(error);
    }
}

export const createStripeCustomer = async (
    email: string,
    uid: string,
    name: string,
    country: string,
    city: string,
    line1: string,
    zip: string | number,
    state?: string) => {
    try {
        const customer = await stripe.customers.create({
            name,
            email,
            address: {
                city,
                country,
                line1,
                postal_code: zip.toString(),
                state,
            },
            metadata: {
                'user_uid': uid,
            },
        });

        return customer.id;
    } catch (error) {
        console.log(error);
    }
}

export const getStripeSubscriptionsByUser = async (uid: string) => {
    const subscriptions = await stripe.subscriptions.search({
        query: `metadata["user_uid"]:"${uid}"`,
    });
    return subscriptions.data;
}

export const getStripeInvoiceLinkById = async (id: string) => {
    const invoice = await stripe.invoices.retrieve(id);
    return invoice;
}

