import hostingPlansData from "@/services/mockData/hostingPlans.json";

class HostingPlanService {
  constructor() {
    this.hostingPlans = [...hostingPlansData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.hostingPlans];
  }

  async getById(id) {
    await this.delay(150);
    return this.hostingPlans.find(plan => plan.Id === id);
  }

  async create(planData) {
    await this.delay(400);
    const newPlan = {
      ...planData,
      Id: Math.max(...this.hostingPlans.map(p => p.Id)) + 1
    };
    this.hostingPlans.push(newPlan);
    return newPlan;
  }

  async update(id, planData) {
    await this.delay(350);
    const index = this.hostingPlans.findIndex(plan => plan.Id === id);
    if (index !== -1) {
      this.hostingPlans[index] = { ...this.hostingPlans[index], ...planData };
      return this.hostingPlans[index];
    }
    throw new Error("Hosting plan not found");
  }

  async delete(id) {
    await this.delay(300);
    const index = this.hostingPlans.findIndex(plan => plan.Id === id);
    if (index !== -1) {
      const deletedPlan = this.hostingPlans.splice(index, 1)[0];
      return deletedPlan;
    }
    throw new Error("Hosting plan not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const hostingPlanService = new HostingPlanService();