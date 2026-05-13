'use client';

import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { adminService } from '@/features/admin/service';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/roles';
import { AlertCircle, ShieldCheck, Trash2, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminReportsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadReports = () => {
    adminService.getReports()
      .then(res => setReports(res.content))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) { router.replace('/login'); return; }
    if (!isAdmin(user)) { router.replace('/'); return; }
    loadReports();
  }, [isHydrated, user, router]);

  const handleAction = async (reportId: string, action: 'DISMISSED' | 'ACTION_TAKEN') => {
    if (!confirm(`Mark this report as ${action}?`)) return;
    try {
      setIsProcessing(reportId);
      await adminService.reviewReport(reportId, action);
      loadReports();
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
            <h1 className="font-display text-3xl font-bold text-fg">Event <span className="text-gradient-brand">Reports</span></h1>
            <p className="text-fg-secondary mt-1">Review community flags for spam or inappropriate content.</p>
          </div>
        </div>

        <div className="anim-rise delay-100 space-y-4">
          {reports.length === 0 ? (
            <EmptyState icon={<ShieldCheck />} title="All Clear" description="There are no pending reports to review." />
          ) : (
            reports.map((report) => (
              <div key={report.id} className="bg-surface border border-line rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-pill text-[10px] font-bold uppercase tracking-wide border ${
                      report.status === 'PENDING' ? 'bg-warning-soft text-warning border-warning/20' : 'bg-surface-2 text-fg-muted border-line'
                    }`}>
                      {report.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-pill bg-danger-soft text-danger border border-danger/20 text-[10px] font-bold uppercase tracking-wide">
                      {report.reason}
                    </span>
                  </div>
                  <p className="text-sm text-fg-secondary mt-2">"{report.description}"</p>
                  <p className="text-xs text-fg-muted">Reported on: {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {/* Optional: Link to the reported event if the backend returns the event ID/Slug */}
                  {report.eventId && (
                    <Link href={`/events/${report.eventId}`}>
                      <Button variant="outline" size="sm"><ExternalLink className="size-4 mr-1.5" /> View Event</Button>
                    </Link>
                  )}
                  {report.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        disabled={isProcessing === report.id}
                        onClick={() => handleAction(report.id, 'DISMISSED')}
                      >
                        <Trash2 className="size-4 mr-1.5 text-fg-muted" /> Dismiss
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-danger hover:bg-danger-soft border-danger/30"
                        disabled={isProcessing === report.id}
                        onClick={() => handleAction(report.id, 'ACTION_TAKEN')}
                      >
                        <AlertCircle className="size-4 mr-1.5" /> Action Taken
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </PublicShell>
  );
}