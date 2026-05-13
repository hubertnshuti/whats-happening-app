'use client';

import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { adminService, type StatsResponse } from '@/features/admin/service';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import { Card } from '@/components/ui/Card';
import { Users, Calendar, AlertCircle, CheckCircle, BarChart3, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/roles';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) { router.replace('/login'); return; }
    if (!isAdmin(user)) { router.replace('/'); return; }

    adminService.getStats()
      .then((res) => setStats(res))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isHydrated, user, router]);

  if (!isHydrated || isLoading) {
    return <PublicShell><div className="flex h-[60vh] items-center justify-center"><Spinner /></div></PublicShell>;
  }

  if (!stats) {
    return <PublicShell><EmptyState icon={<AlertCircle />} title="Failed to load dashboard" description="Could not fetch admin statistics." /></PublicShell>;
  }

  // Added 'href' to each card to make them clickable
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-brand', href: '/admin/users' },
    { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-success', href: '/admin/users' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: AlertCircle, color: 'text-danger', href: '/admin/reports' },
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-brand', href: '/events' },
    { label: 'Published Events', value: stats.publishedEvents, icon: CheckCircle, color: 'text-success', href: '/events' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: BarChart3, color: 'text-info', href: '/events' },
  ];

  return (
    <PublicShell>
      <main className="container-page py-10 space-y-8">
        <div className="anim-rise flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-fg">Admin <span className="text-gradient-brand">Dashboard</span></h1>
            <p className="text-fg-secondary mt-1">Platform overview and statistics.</p>
          </div>
        </div>

        <div className="anim-rise delay-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link key={idx} href={stat.href} className="block group">
                <Card className="p-6 flex items-center gap-4 hover:border-brand hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`p-4 rounded-xl bg-surface-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm text-fg-muted font-medium uppercase tracking-wide group-hover:text-fg-secondary transition-colors">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-fg nums mt-1">{stat.value}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </PublicShell>
  );
}