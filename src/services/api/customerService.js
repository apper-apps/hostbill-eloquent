import customersData from "@/services/mockData/customers.json";

class CustomerService {
  constructor() {
    this.customers = [...customersData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.customers];
  }

  async getById(id) {
    await this.delay(200);
    return this.customers.find(customer => customer.Id === id);
  }

  async create(customerData) {
    await this.delay(400);
    const newCustomer = {
      ...customerData,
      Id: Math.max(...this.customers.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: "active"
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async update(id, customerData) {
    await this.delay(350);
    const index = this.customers.findIndex(customer => customer.Id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...customerData };
      return this.customers[index];
    }
    throw new Error("Customer not found");
  }

  async delete(id) {
    await this.delay(300);
    const index = this.customers.findIndex(customer => customer.Id === id);
    if (index !== -1) {
      const deletedCustomer = this.customers.splice(index, 1)[0];
      return deletedCustomer;
    }
    throw new Error("Customer not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const customerService = new CustomerService();