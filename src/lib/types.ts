export type Role = "Manager" | "Store Keeper";

export type Session = {
  token: string;
  role: Role;
  email: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  updatedAt: string;
};
