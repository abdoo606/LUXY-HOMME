import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n/translations';

export interface Product {
  id: number;
  name: Record<Language, string>;
  description: Record<Language, string>;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export type Currency = 'USD' | 'EUR' | 'SAR' | 'GBP' | 'TRY';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  rate: number;
  name: string;
}

export const currencies: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'SAR', symbol: 'ر.س', rate: 3.75, name: 'Saudi Riyal' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'TRY', symbol: '₺', rate: 32.5, name: 'Turkish Lira' },
];

interface StoreState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // UI
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth (simulated)
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        document.body.className = newTheme;
        set({ theme: newTheme });
      },

      // Language
      language: 'en',
      setLanguage: (language) => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        if (language === 'ar') {
          document.body.setAttribute('dir', 'rtl');
        } else {
          document.body.setAttribute('dir', 'ltr');
        }
        set({ language });
      },

      // Currency
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),

      // Cart
      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        const existing = cart.find(
          (i) => i.product.id === item.product.id && i.size === item.size && i.color === item.color
        );
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.product.id === item.product.id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (productId, size, color) => {
        set({
          cart: get().cart.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        });
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // UI
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Auth
      isAuthenticated: false,
      user: null,
      login: (name, email) => set({ isAuthenticated: true, user: { name, email } }),
      logout: () => set({ isAuthenticated: false, user: null }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },
    }),
    {
      name: 'luxe-homme-store',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        currency: state.currency,
        cart: state.cart,
        wishlist: state.wishlist,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
