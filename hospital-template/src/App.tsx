import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyButton from './components/EmergencyButton';
import DoctorProfileModal from './components/DoctorProfileModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentPage from './pages/AppointmentPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AdminPage from './pages/AdminPage';
import type { Doctor } from './config/content';

export default function App() {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const [page, setPage] = useState('home');
  const [deptPayload, setDeptPayload] = useState<string | null>(null);
  const [doctorPayload, setDoctorPayload] = useState<string | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);

  // Initialize direction & language on load
  useEffect(() => {
    setLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useCallback((next: string, payload?: string) => {
    setDeptPayload(null);
    setDoctorPayload(null);
    if (next === 'departments' && payload) setDeptPayload(payload);
    if (next === 'appointment' && payload) {
      // payload is department id when coming from a department card
      setDeptPayload(payload);
    }
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const bookDoctor = useCallback((doctor: Doctor) => {
    setDoctorPayload(doctor.id);
    setDeptPayload(doctor.department);
    setPage('appointment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const bookFromProfile = useCallback((doctor: Doctor) => {
    setProfileDoctor(null);
    bookDoctor(doctor);
  }, [bookDoctor]);

  const renderPage = () => {
    switch (page) {
      case 'about':
        return <AboutPage />;
      case 'departments':
        return (
          <DepartmentsPage
            onNavigate={navigate}
            onBookDoctor={bookDoctor}
            onDoctorProfile={setProfileDoctor}
            initialDepartment={deptPayload}
          />
        );
      case 'doctors':
        return <DoctorsPage onBookDoctor={bookDoctor} onDoctorProfile={setProfileDoctor} />;
      case 'appointment':
        return (
          <AppointmentPage
            onNavigate={navigate}
            initialDepartment={deptPayload}
            initialDoctor={doctorPayload}
          />
        );
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'myAppointments':
        return <MyAppointmentsPage onNavigate={navigate} />;
      case 'admin':
        return <AdminPage onExit={() => navigate('home')} />;
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onBookDoctor={bookDoctor}
            onDoctorProfile={setProfileDoctor}
          />
        );
    }
  };

  // Admin has its own full-screen layout
  if (page === 'admin') {
    return <AdminPage onExit={() => navigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page + (deptPayload ?? '') + (doctorPayload ?? '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={navigate} />
      <EmergencyButton />

      <DoctorProfileModal
        doctor={profileDoctor}
        onClose={() => setProfileDoctor(null)}
        onBook={bookFromProfile}
      />
    </div>
  );
}
