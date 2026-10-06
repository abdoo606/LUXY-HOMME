import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './useStore';
import { products as initialProducts } from '../data/products';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
  avatar: string;
}

interface AdminState {
  // Auth
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Stats
  getStats: () => {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    totalProducts: number;
    lowStock: number;
  };
}

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@luxehomme.com',
  password: 'Admin@2025',
  name: 'Admin User',
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Auth
      isAdminAuthenticated: false,
      adminUser: null,

      adminLogin: (email: string, password: string) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({
            isAdminAuthenticated: true,
            adminUser: {
              id: 'admin-001',
              email: ADMIN_CREDENTIALS.email,
              name: ADMIN_CREDENTIALS.name,
              role: 'admin',
              avatar: '👨‍💼',
            },
          });
          return true;
        }
        return false;
      },

      adminLogout: () => {
        set({ isAdminAuthenticated: false, adminUser: null });
      },

      // Orders
      orders: [],

      addOrder: (orderData) => {
        const orderNumber = 'LH-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
        const now = new Date().toISOString();
        const newOrder: Order = {
          ...orderData,
          id: 'order-' + Date.now(),
          orderNumber,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => {
          const updatedOrders = [newOrder, ...state.orders];
          return { orders: updatedOrders };
        });
        
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      // Products
      products: initialProducts,

      addProduct: (productData) => {
        const maxId = Math.max(...get().products.map((p) => p.id), 0);
        const newProduct = { ...productData, id: maxId + 1 } as Product;
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      // Stats
      getStats: () => {
        const { orders, products } = get();
        const completedOrders = orders.filter((o) => o.status === 'delivered').length;
        const totalRevenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0);

        return {
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          completedOrders,
          totalProducts: products.length,
          lowStock: products.filter((p) => !p.inStock).length,
        };
      },
    }),
    {
      name: 'luxe-homme-admin-db',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
        orders: state.orders,
        products: state.products,
      }),
    }
  )
);
