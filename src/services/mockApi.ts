import type { Product, Role, Session } from "../lib/types";
import { storage } from "../lib/storage";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DEMO_USERS = {
  "manager@demo.com": { password: "manager123", role: "Manager" as Role },
  "keeper@demo.com": { password: "keeper123", role: "Store Keeper" as Role },
};

const SEED_PRODUCTS: Product[] = [
  { id: "p1", name: "Rice 5 kg", sku: "RICE-5KG", price: 349, stock: 18, updatedAt: new Date().toISOString() },
  { id: "p2", name: "Wheat Flour 1 kg", sku: "ATTA-1KG", price: 58, stock: 6, updatedAt: new Date().toISOString() },
  { id: "p3", name: "Cooking Oil 1 L", sku: "OIL-1L", price: 149, stock: 3, updatedAt: new Date().toISOString() },
];

export const mockApi = {
  login: async (email: string, pass: string): Promise<Session> => {
    await sleep(500);
    const user = DEMO_USERS[email.toLowerCase().trim() as keyof typeof DEMO_USERS];

    if (!user || user.password !== pass) {
      throw new Error("Invalid demo credentials");
    }

    return { token: "demo-token", role: user.role, email };
  },

  getProducts: async (): Promise<Product[]> => {
    await sleep(500);
    const products = storage.getProducts();
    
    if (!products || products.length === 0) {
      storage.setProducts(SEED_PRODUCTS);
      return SEED_PRODUCTS;
    }
    
    return products;
  },
};