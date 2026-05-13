'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicShell } from '@/components/layout/PublicShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import { eventService } from '@/features/events/service';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, Save, Globe, Ban, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic form state (in a real app, use react-hook-form. Keeping it lean here to ensure it works fast)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    eventService.byId(id)
      .then(data => {
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description || '');
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id, isHydrated]);

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/events/${id}`, { title, description });
      router.push(`/events/${event.slug}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action: 'publish' | 'cancel') => {
    try {
      setIsSubmitting(true);
      await api.post(`/events/${id}/${action}`);
      router.push(`/events/${event.slug}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/events/${id}`);
      router.push('/organizer/events');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!isHydrated || isLoading) return <PublicShell><div className="flex h-[60vh] items-center justify-center"><Spinner /></div></PublicShell>;
  if (!event) return <PublicShell><EmptyState title="Event Not Found" description="This event does not exist or you don't have access." /></PublicShell>;

  return (
    <PublicShell>
      <main className="container-page py-10 max-w-3xl mx-auto space-y-8">
        <div className="anim-rise space-y-4">
          <Link href="/organizer/events" className="inline-flex items-center text-sm font-medium text-fg-muted hover:text-brand transition-colors">
            <ArrowLeft className="size-4 mr-1" /> Back to My Events
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="font-display text-3xl font-bold text-fg">Edit <span className="text-gradient-brand">Event</span></h1>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-pill bg-surface-2 border border-line text-xs font-bold uppercase">{event.status}</span>
            </div>
          </div>
        </div>

        <div className="anim-rise delay-100 bg-surface p-6 sm:p-8 rounded-2xl border border-line shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Event Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Description</label>
              <textarea 
                className="w-full min-h-[120px] rounded-xl bg-surface border border-line px-4 py-3 text-fg focus:border-brand outline-none transition-colors"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-line flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <Button onClick={handleUpdate} disabled={isSubmitting} variant="primary">
                <Save className="size-4 mr-2" /> Save Changes
              </Button>
              {event.status === 'DRAFT' || event.status === 'PENDING_APPROVAL' ? (
                <Button onClick={() => handleAction('publish')} disabled={isSubmitting} variant="outline" className="text-success border-success/30 hover:bg-success-soft">
                  <Globe className="size-4 mr-2" /> Publish Event
                </Button>
              ) : null}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => handleAction('cancel')} disabled={isSubmitting} variant="ghost" className="text-warning hover:bg-warning-soft">
                <Ban className="size-4 mr-2" /> Cancel Event
              </Button>
              <Button onClick={handleDelete} disabled={isSubmitting} variant="ghost" className="text-danger hover:bg-danger-soft">
                <Trash2 className="size-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}