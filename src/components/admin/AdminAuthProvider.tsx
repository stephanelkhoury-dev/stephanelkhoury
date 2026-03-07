'use client';

import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

type AdminAuthContextValue = {
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
    });
    router.push('/admin/sign-in');
    router.refresh();
  };

  return (
    <AdminAuthContext.Provider value={{ signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }
  return context;
}
