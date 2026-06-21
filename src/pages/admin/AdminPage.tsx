import { useAdminStore } from '../../store/adminStore';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface AdminPageProps {
  onExit: () => void;
}

export default function AdminPage({ onExit }: AdminPageProps) {
  const { isAdminAuthenticated } = useAdminStore();

  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return <AdminDashboard onLogout={onExit} />;
}
