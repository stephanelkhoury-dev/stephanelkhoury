import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminAuthProvider>
  );
}
