'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicShell } from '@/components/layout/PublicShell';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/feedback';
import { EmptyState } from '@/components/ui/feedback';
import { forumService } from '@/features/forums/service';
import { eventService } from '@/features/events/service';
import { ForumResponse, MessageResponse } from '@/features/forums/types';
import { ForumMessageCard } from '@/features/forums/components/ForumMessageCard';
import { ForumComposer } from '@/features/forums/components/ForumComposer';
import { MessageSquare, ArrowLeft, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function EventForumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [forum, setForum] = useState<ForumResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      // 1. Get Event by slug to get UUID
      const eventDetail = await eventService.bySlug(slug);
      setEventId(eventDetail.id);
      
      // 2. Get Forum & Messages
      const forumData = await forumService.getForum(eventDetail.id);
      setForum(forumData);
      
      if (forumData.isMember || user?.roles.includes('ADMIN')) {
        const msgs = await forumService.getMessages(eventDetail.id);
        setMessages(msgs.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated) loadData();
  }, [slug, isHydrated]);

  const handleJoin = async () => {
    if (!eventId || !user) {
      router.push('/login');
      return;
    }
    try {
      setIsJoining(true);
      await forumService.joinForum(eventId);
      await loadData();
    } finally {
      setIsJoining(false);
    }
  };

  if (!isHydrated || isLoading) {
    return <PublicShell><div className="flex h-[60vh] items-center justify-center"><Spinner /></div></PublicShell>;
  }

  if (!forum) {
    return (
      <PublicShell>
        <div className="container-page py-12">
          <EmptyState icon={<MessageSquare />} title="Forum Not Found" description="This event doesn't have an active forum." />
        </div>
      </PublicShell>
    );
  }

  const canPost = forum.isMember && user?.roles.some(r => ['ORGANIZER', 'ADMIN', 'SUPER_ADMIN'].includes(r));

  return (
    <PublicShell>
      {/* Decorative Glow */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.73 0.17 35 / 0.45) 0%, transparent 70%)" }} />

      <main className="container-page py-8 max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="anim-rise space-y-4">
          <Link href={`/events/${slug}`} className="inline-flex items-center text-sm font-medium text-fg-muted hover:text-brand transition-colors">
            <ArrowLeft className="size-4 mr-1" /> Back to Event
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
                Official <span className="text-gradient-brand">Forum</span>
              </h1>
              <p className="text-fg-secondary mt-1">{forum.eventTitle}</p>
            </div>
            {forum.isMember ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-pill border border-line text-sm text-fg-muted">
                <Users className="size-4" /> Joined
              </div>
            ) : (
              <Button variant="primary" size="md" onClick={handleJoin} disabled={isJoining}>
                {isJoining && <Loader2 className="size-4 animate-spin mr-2" />}
                Join Forum to get updates
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {!forum.isMember && user ? (
          <div className="anim-rise delay-100 p-8 text-center rounded-2xl bg-surface border border-line border-dashed">
            <MessageSquare className="size-8 text-brand mx-auto mb-3 opacity-80" />
            <h3 className="font-bold text-lg text-fg mb-1">Members Only</h3>
            <p className="text-sm text-fg-secondary">You must join this forum to view announcements and updates.</p>
          </div>
        ) : (
          <div className="anim-rise delay-100 space-y-6">
            {canPost && <ForumComposer eventId={forum.eventId} onPosted={loadData} />}
            
            <div className="space-y-4">
              {messages.length === 0 ? (
                <EmptyState 
                  icon={<MessageSquare className="text-brand opacity-50" />} 
                  title="No announcements yet" 
                  description="The organizer will post official updates here." 
                />
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg.id} className={`anim-rise delay-${(idx % 5) * 100}`}>
                    <ForumMessageCard message={msg} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </PublicShell>
  );
}