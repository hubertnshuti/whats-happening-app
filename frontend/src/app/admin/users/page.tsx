'use client';

import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { adminService } from '@/features/admin/service';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Users, Shield, Ban, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadUsers = () => {
    adminService.getUsers()
      .then(res => setUsers(res.content))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isHydrated) return;
    if (!user?.roles.includes('ADMIN') && !user?.roles.includes('SUPER_ADMIN')) {
      router.replace('/unauthorized');
      return;
    }
    loadUsers();
  }, [isHydrated, user, router]);

  const toggleStatus = async (targetUser: any) => {
    if (!confirm(`Are you sure you want to change ${targetUser.fullName}'s status?`)) return;
    try {
      setIsProcessing(targetUser.id);
      const newStatus = targetUser.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await adminService.updateUserStatus(targetUser.id, newStatus);
      loadUsers(); // reload table
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  if (!isHydrated || isLoading) return <PublicShell><div className="flex h-[60vh] items-center justify-center"><Spinner /></div></PublicShell>;

  return (
    <PublicShell>
      <main className="container-page py-10 space-y-8">
        <div className="anim-rise space-y-4">
          <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-fg-muted hover:text-brand transition-colors">
            <ArrowLeft className="size-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-fg">Manage <span className="text-gradient-brand">Users</span></h1>
            <p className="text-fg-secondary mt-1">View, suspend, or activate platform accounts.</p>
          </div>
        </div>

        <div className="anim-rise delay-100 bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
          {users.length === 0 ? (
            <EmptyState icon={<Users />} title="No Users Found" description="The database returned 0 users." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-2 border-b border-line text-fg-muted font-medium uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Roles</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-2/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-fg">{u.fullName}</td>
                      <td className="px-6 py-4 text-fg-secondary">{u.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {u.roles.map((r: string) => (
                            <span key={r} className="px-2 py-0.5 rounded-md bg-brand-soft text-brand text-[10px] font-bold">
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-pill text-[10px] font-bold uppercase tracking-wide border ${
                          u.accountStatus === 'ACTIVE' ? 'bg-success-soft text-success border-success/20' : 'bg-danger-soft text-danger border-danger/20'
                        }`}>
                          {u.accountStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user?.id && ( // Don't let admin suspend themselves
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={isProcessing === u.id}
                            onClick={() => toggleStatus(u)}
                            className={u.accountStatus === 'ACTIVE' ? 'text-danger hover:border-danger hover:bg-danger-soft' : 'text-success hover:border-success hover:bg-success-soft'}
                          >
                            {u.accountStatus === 'ACTIVE' ? <Ban className="size-4 mr-1.5" /> : <CheckCircle className="size-4 mr-1.5" />}
                            {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}