import subscriptionsData from "@/services/mockData/subscriptions.json";
import { paymentService } from "./paymentService";

class SubscriptionService {
  constructor() {
    this.subscriptions = [...subscriptionsData].map(sub => ({
      ...sub,
      paymentMethod: sub.Id % 2 === 0 ? 'stripe' : 'gocardless',
      paymentStatus: sub.status === 'active' ? 'paid' : 'pending',
      lastPaymentDate: sub.status === 'active' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      nextPaymentDate: sub.renewalDate,
      paymentFailureReason: sub.status === 'suspended' ? 'insufficient_funds' : null
    }));
  }

  async getAll() {
    await this.delay(300);
    return [...this.subscriptions];
  }

  async getById(id) {
    await this.delay(200);
    return this.subscriptions.find(subscription => subscription.Id === id);
  }

  async create(subscriptionData) {
    await this.delay(400);
    
    try {
      // Create subscription with payment processing
      const paymentResult = await paymentService.createSubscription(subscriptionData, subscriptionData.customer);
      
      const newSubscription = {
        ...subscriptionData,
        Id: Math.max(...this.subscriptions.map(s => s.Id)) + 1,
        startDate: new Date().toISOString(),
        status: paymentResult.status === 'active' ? 'active' : 'pending',
        paymentMethod: paymentResult.paymentMethod,
        paymentStatus: paymentResult.status === 'active' ? 'paid' : 'pending',
        lastPaymentDate: paymentResult.status === 'active' ? new Date().toISOString() : null,
        nextPaymentDate: paymentResult.nextBilling,
        paymentFailureReason: null
      };
      
      this.subscriptions.push(newSubscription);
      return newSubscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async update(id, subscriptionData) {
    await this.delay(350);
    const index = this.subscriptions.findIndex(subscription => subscription.Id === id);
    if (index !== -1) {
      this.subscriptions[index] = { ...this.subscriptions[index], ...subscriptionData };
      return this.subscriptions[index];
    }
    throw new Error("Subscription not found");
  }

  async delete(id) {
    await this.delay(300);
    const index = this.subscriptions.findIndex(subscription => subscription.Id === id);
    if (index !== -1) {
      const subscription = this.subscriptions[index];
      
      // Cancel payment subscription
      try {
        await paymentService.cancelSubscription(subscription.Id, subscription.paymentMethod);
      } catch (error) {
        console.warn('Failed to cancel payment subscription:', error);
      }
      
      const deletedSubscription = this.subscriptions.splice(index, 1)[0];
      return deletedSubscription;
    }
    throw new Error("Subscription not found");
  }

  // Retry failed payment
  async retryPayment(id) {
    await this.delay(500);
    const index = this.subscriptions.findIndex(subscription => subscription.Id === id);
    if (index === -1) {
      throw new Error("Subscription not found");
    }

    const subscription = this.subscriptions[index];
    
    try {
      const paymentResult = await paymentService.retryPayment(
        subscription.Id,
        subscription.amount,
        { paymentMethod: subscription.paymentMethod }
      );

      // Update subscription based on payment result
      this.subscriptions[index] = {
        ...subscription,
        paymentStatus: paymentResult.status,
        lastPaymentDate: paymentResult.status === 'completed' ? new Date().toISOString() : subscription.lastPaymentDate,
        paymentFailureReason: paymentResult.status === 'completed' ? null : subscription.paymentFailureReason,
        status: paymentResult.status === 'completed' ? 'active' : subscription.status
      };

      return this.subscriptions[index];
    } catch (error) {
      // Update failure reason
      this.subscriptions[index] = {
        ...subscription,
        paymentFailureReason: error.message,
        paymentStatus: 'failed'
      };
      throw error;
    }
  }

  // Process subscription renewal
  async processRenewal(id) {
    await this.delay(600);
    const index = this.subscriptions.findIndex(subscription => subscription.Id === id);
    if (index === -1) {
      throw new Error("Subscription not found");
    }

    const subscription = this.subscriptions[index];
    
    try {
      const paymentResult = await paymentService.processSubscriptionPayment(
        subscription.Id,
        subscription.amount,
        { paymentMethod: subscription.paymentMethod }
      );

      // Update renewal date and payment status
      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + (subscription.billingCycle === 'monthly' ? 1 : 12));

      this.subscriptions[index] = {
        ...subscription,
        paymentStatus: paymentResult.status,
        lastPaymentDate: new Date().toISOString(),
        nextPaymentDate: renewalDate.toISOString(),
        renewalDate: renewalDate.toISOString(),
        paymentFailureReason: null,
        status: 'active'
      };

      return this.subscriptions[index];
    } catch (error) {
      // Handle renewal failure
      this.subscriptions[index] = {
        ...subscription,
        paymentFailureReason: error.message,
        paymentStatus: 'failed',
        status: 'suspended'
      };
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const subscriptionService = new SubscriptionService();