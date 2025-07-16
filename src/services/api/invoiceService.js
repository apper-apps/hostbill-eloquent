import invoicesData from "@/services/mockData/invoices.json";

class InvoiceService {
  constructor() {
    this.invoices = [...invoicesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.invoices];
  }

  async getById(id) {
    await this.delay(200);
    return this.invoices.find(invoice => invoice.Id === id);
  }

  async create(invoiceData) {
    await this.delay(400);
    const newInvoice = {
      ...invoiceData,
      Id: Math.max(...this.invoices.map(i => i.Id)) + 1,
      status: "pending"
    };
    this.invoices.push(newInvoice);
    return newInvoice;
  }

  async update(id, invoiceData) {
    await this.delay(350);
    const index = this.invoices.findIndex(invoice => invoice.Id === id);
    if (index !== -1) {
      this.invoices[index] = { ...this.invoices[index], ...invoiceData };
      return this.invoices[index];
    }
    throw new Error("Invoice not found");
  }

  async delete(id) {
    await this.delay(300);
    const index = this.invoices.findIndex(invoice => invoice.Id === id);
    if (index !== -1) {
      const deletedInvoice = this.invoices.splice(index, 1)[0];
      return deletedInvoice;
    }
    throw new Error("Invoice not found");
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const invoiceService = new InvoiceService();