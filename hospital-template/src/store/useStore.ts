import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '../config/site.config';

export interface Appointment {
  id: string;
  ref: string;
  departmentId: string;
  departmentName: string;
  doctorId: string | null;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    reason: string;
    notes: string;
    isNew: boolean;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface StoreState {
  language: Lang;
  setLanguage: (lang: Lang) => void;

  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, 'id' | 'ref' | 'status' | 'createdAt'>) => Appointment;
  cancelAppointment: (id: string) => void;

  contactMessages: {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: string;
    read: boolean;
  }[];
  addMessage: (msg: { name: string; email: string; phone: string; subject: string; message: string }) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        document.body.setAttribute('dir', dir);
        set({ language });
      },

      isMobileMenuOpen: false,
      setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),

      appointments: [],
      addAppointment: (data) => {
        const ref = 'APT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
        const newAppt: Appointment = {
          ...data,
          id: 'appt-' + Date.now(),
          ref,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ appointments: [...s.appointments, newAppt] }));
        return newAppt;
      },
      cancelAppointment: (id) => {
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)),
        }));
      },

      contactMessages: [],
      addMessage: (msg) => {
        set((s) => ({
          contactMessages: [
            {
              ...msg,
              id: 'msg-' + Date.now(),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.contactMessages,
          ],
        }));
        void get();
      },
    }),
    {
      name: 'clinic-template-store',
      partialize: (s) => ({
        language: s.language,
        appointments: s.appointments,
        contactMessages: s.contactMessages,
      }),
    }
  )
);
