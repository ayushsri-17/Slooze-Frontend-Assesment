export type Role = "Manager" | "Store Keeper";

export type Session = {
  token: string;
  role: Role;
  email: string;
  product: string;
};
