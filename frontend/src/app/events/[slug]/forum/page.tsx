'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicShell } from '@/components/layout/PublicShell';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/feedback';
import { EmptyState } from '@/components/ui/feedback';
import { forumService } from '@/features/forums/service';
import { eventService } from '@/features/events/service';
import type { EventDetail } from '@/features/events/types';
import { ForumResponse, MessageResponse, QuestionResponse } from '@/features/forums/types';
import { ForumMessageCard } from '@/features/forums/components/ForumMessageCard';
import { ForumComposer } from '@/features/forums/components/ForumComposer';
import { ForumQA } from '@/features/forums/components/ForumQA';
import { MessageSquare, ArrowLeft, Users, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function EventForumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [forum, setForum] = useState<ForumResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const isOrganizer = !!(user && event && event.organizer?.id === user.id);
  const isMember = !!forum?.member || isOrganizer || !!forum?.organizer;
  const canPost = isMember && (isOrganizer || !!forum?.organizer ||
    user?.roles.some(r => ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(r)));

  const loadData = async (knownEventId?: string) => {
    try {
      const eventDetail = await eventService.bySlug(slug);
      setEvent(eventDetail);

      const eventId = knownEventId ?? eventDetail.id;
      const forumData = await forumService.getForum(eventId);
      setForum(forumData);

      const [msgs, qs] = await Promise.all([
        forumService.getMessages(eventId),
        forumService.getQuestions(eventId),
      ]);
      setMessages(msgs.content);
      setQuestions(qs.content);
    } catch (err) {
      console.error('Forum load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-join organizer silently so they show up as member in backend
  useEffect(() => {
    if (!forum || !event || !user) return;
    if (event.organizer?.id === user.id && !forum.member && !forum.organizer) {
      forumService.joinForum(event.id)
        .then(() => loadData(event.id))
        .catch(() => {});
    }
  }, [forum?.id, user?.id]);

  useEffect(() => {
    if (isHydrated) loadData();
  }, [slug, isHydrated]);

  const handleJoin = async () => {
    if (!user) { router.push('/login'); return; }
    if (!event) return;
    setJoinError(null);
    try {
      setIsJoining(true);
      const updatedForum = await forumService.joinForum(event.id);
      setForum(updatedForum);
    } catch (err: any) {
      setJoinError(err?.message ?? 'Could not join. Please try again.');
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
          <EmptyState icon={<MessageSquare />} title="Forum Not Found" description="This event doesn't have an active forum yet." />
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, oklch(0.73 0.17 35 / 0.45) 0%, transparent 70%)' }} />

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
            {isMember ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-pill border border-line text-sm text-fg-muted">
                <Users className="size-4" /> {isOrganizer || forum.organizer ? 'Organizer' : 'Joined'}
              </div>
            ) : user ? (
              <div className="flex flex-col items-end gap-1">
                <Button variant="primary" size="md" onClick={handleJoin} disabled={isJoining}>
                  {isJoining ? <><Loader2 className="size-4 animate-spin mr-2" />Joining…</> : 'Join for updates'}
                </Button>
                {joinError && (
                  <p className="flex items-center gap-1 text-xs text-danger">
                    <AlertCircle className="size-3" />{joinError}
                  </p>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="md">Log in to join</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Composer — only for organizer/admin */}
        {canPost && <ForumComposer eventId={forum.eventId} onPosted={() => loadData(event?.id)} />}

        {/* Messages — visible to everyone */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="text-brand opacity-50" />}
              title="No announcements yet"
              description={canPost ? 'Post your first announcement above.' : 'The organizer will post official updates here.'}
            />
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id} className={`anim-rise delay-${(idx % 5) * 100}`}>
                <ForumMessageCard
                  message={msg}
                  eventId={forum.eventId}
                  canReact={!!user}
                />
              </div>
            ))
          )}
        </div>

        {/* Q&A section */}
        <ForumQA
          eventId={forum.eventId}
          questions={questions}
          canAnswer={canPost}
          isLoggedIn={!!user && isMember}
          onQuestionAdded={q => setQuestions(prev => [q, ...prev])}
          onAnswered={q => setQuestions(prev => prev.map(old => old.id === q.id ? q : old))}
        />

      </main>
    </PublicShell>
  );
}
