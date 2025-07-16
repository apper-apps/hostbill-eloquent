// Payment Service - Unified interface for Stripe and GoCardless
class PaymentService {
  constructor() {
    this.stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    this.stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
    this.gocardlessToken = import.meta.env.GOCARDLESS_ACCESS_TOKEN;
    this.gocardlessEnv = import.meta.env.GOCARDLESS_ENVIRONMENT || 'sandbox';
  }

  // Determine payment method based on customer preferences or region
  getPreferredPaymentMethod(customer) {
    // Default to Stripe for card payments, GoCardless for direct debit
    if (customer.paymentMethod === 'direct_debit' || customer.region === 'EU') {
      return 'gocardless';
    }
    return 'stripe';
  }

  // Process subscription payment
  async processSubscriptionPayment(subscriptionId, amount, customer) {
    try {
      const paymentMethod = this.getPreferredPaymentMethod(customer);
      
      if (paymentMethod === 'stripe') {
        return await this.processStripePayment(subscriptionId, amount, customer);
      } else {
        return await this.processGoCardlessPayment(subscriptionId, amount, customer);
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  // Stripe payment processing
  async processStripePayment(subscriptionId, amount, customer) {
    await this.delay(800);
    
    // Simulate Stripe API call
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        transactionId: `stripe_${Date.now()}`,
        paymentMethod: 'stripe',
        amount: amount,
        currency: 'USD',
        status: 'completed'
      };
    } else {
      throw new Error('Stripe payment failed - insufficient funds');
    }
  }

  // GoCardless payment processing
  async processGoCardlessPayment(subscriptionId, amount, customer) {
    await this.delay(1000);
    
    // Simulate GoCardless API call
    const success = Math.random() > 0.05; // 95% success rate for direct debit
    
    if (success) {
      return {
        success: true,
        transactionId: `gc_${Date.now()}`,
        paymentMethod: 'gocardless',
        amount: amount,
        currency: 'USD',
        status: 'pending' // Direct debit takes time to process
      };
    } else {
      throw new Error('GoCardless payment failed - invalid mandate');
    }
  }

  // Create subscription with payment method
  async createSubscription(subscriptionData, customer) {
    try {
      const paymentMethod = this.getPreferredPaymentMethod(customer);
      
      if (paymentMethod === 'stripe') {
        return await this.createStripeSubscription(subscriptionData, customer);
      } else {
        return await this.createGoCardlessSubscription(subscriptionData, customer);
      }
    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw error;
    }
  }

  // Create Stripe subscription
  async createStripeSubscription(subscriptionData, customer) {
    await this.delay(600);
    
    return {
      success: true,
      subscriptionId: `sub_stripe_${Date.now()}`,
      paymentMethod: 'stripe',
      status: 'active',
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Create GoCardless subscription
  async createGoCardlessSubscription(subscriptionData, customer) {
    await this.delay(800);
    
    return {
      success: true,
      subscriptionId: `sub_gc_${Date.now()}`,
      paymentMethod: 'gocardless',
      status: 'pending_customer_approval',
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Retry failed payment
  async retryPayment(subscriptionId, amount, customer) {
    try {
      const result = await this.processSubscriptionPayment(subscriptionId, amount, customer);
      return result;
    } catch (error) {
      console.error('Payment retry failed:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, paymentMethod) {
    await this.delay(500);
    
    // Simulate gateway cancellation
    return {
      success: true,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };
  }

  // Get payment status
  async getPaymentStatus(transactionId) {
    await this.delay(200);
    
    // Simulate status check
    const statuses = ['completed', 'pending', 'failed', 'cancelled'];
    return {
      transactionId,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      updatedAt: new Date().toISOString()
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const paymentService = new PaymentService();