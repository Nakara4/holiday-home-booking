// This would be in a separate file (e.g., api/create-payment-intent.js)
const stripe = require('stripe')('sk_test_your_test_secret_key');

module.exports = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
        });
        
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};