import subscriptionsData from "@/services/mockData/subscriptions.json";

class SubscriptionService {
  constructor() {
    this.subscriptions = [...subscriptionsData];
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
    const newSubscription = {
      ...subscriptionData,
      Id: Math.max(...this.subscriptions.map(s => s.Id)) + 1,
      startDate: new Date().toISOString(),
      status: "active"
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
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
      const deletedSubscription = this.subscriptions.splice(index, 1)[0];
      return deletedSubscription;
    }
    throw new Error("Subscription not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const subscriptionService = new SubscriptionService();