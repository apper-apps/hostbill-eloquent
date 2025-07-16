import usageData from "@/services/mockData/usage.json";

class UsageService {
  constructor() {
    this.usage = [...usageData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.usage];
  }

  async getBySubscriptionId(subscriptionId) {
    await this.delay(150);
    return this.usage.filter(usage => usage.subscriptionId === subscriptionId);
  }

  async create(usageData) {
    await this.delay(300);
    const newUsage = {
      ...usageData,
      period: new Date().toISOString().slice(0, 7)
    };
    this.usage.push(newUsage);
    return newUsage;
  }

  async update(subscriptionId, period, usageData) {
    await this.delay(250);
    const index = this.usage.findIndex(usage => 
      usage.subscriptionId === subscriptionId && usage.period === period
    );
    if (index !== -1) {
      this.usage[index] = { ...this.usage[index], ...usageData };
      return this.usage[index];
    }
    throw new Error("Usage record not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const usageService = new UsageService();