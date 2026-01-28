const SESSION_KEY = "slooze_session";
const PRODUCTS_KEY = "slooze_products";
const THEME_KEY = "slooze_theme";


export const storage = {
  getSession: () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setSession: (session: any) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getProducts: () => {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  return raw ? JSON.parse(raw) : null;
},
setProducts: (products: any) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
},

getTheme: () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(THEME_KEY);
},
setTheme: (theme: "light" | "dark") => {
  localStorage.setItem(THEME_KEY, theme);
},

};
