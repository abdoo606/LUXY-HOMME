import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Doctor } from '../config/content';
import { doctors as seedDoctors } from '../config/content';

interface AdminState {
  isAdminAuthenticated: boolean;
  adminUser: { name: string; email: string } | null;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;

  /** Doctor overrides created/edited from the admin panel */
  doctorOverrides: Record<string, Partial<Doctor>>;
  doctorOrder: string[];
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  getDoctors: () => Doctor[];
}

// Demo credentials — change these for each client
export const ADMIN_CREDENTIALS = {
  email: 'admin@hospital.com',
  password: 'Admin@2026',
  name: 'Hospital Admin',
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      adminUser: null,

      adminLogin: (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({
            isAdminAuthenticated: true,
            adminUser: { name: ADMIN_CREDENTIALS.name, email: ADMIN_CREDENTIALS.email },
          });
          return true;
        }
        return false;
      },
      adminLogout: () => set({ isAdminAuthenticated: false, adminUser: null }),

      doctorOverrides: {},
      doctorOrder: [],
      updateDoctor: (id, updates) => {
        set((s) => ({
          doctorOverrides: { ...s.doctorOverrides, [id]: { ...s.doctorOverrides[id], ...updates } },
        }));
      },
      getDoctors: () => {
        const { doctorOverrides, doctorOrder } = get();
        const merged = seedDoctors.map((d) => ({ ...d, ...doctorOverrides[d.id] }));
        if (!doctorOrder.length) return merged;
        const byId = new Map(merged.map((d) => [d.id, d]));
        const ordered = doctorOrder.map((id) => byId.get(id)).filter(Boolean) as Doctor[];
        // append any doctors not in the saved order
        for (const d of merged) if (!doctorOrder.includes(d.id)) ordered.push(d);
        return ordered;
      },
    }),
    {
      name: 'clinic-template-admin',
      partialize: (s) => ({
        isAdminAuthenticated: s.isAdminAuthenticated,
        adminUser: s.adminUser,
        doctorOverrides: s.doctorOverrides,
      }),
    }
  )
);
