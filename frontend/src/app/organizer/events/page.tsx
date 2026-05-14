'use client';

import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { eventService } from '@/features/events/service'; 
import { EventCard } from '@/features/events/components/EventCard';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import { useAuthStore } from '@/store/authStore';
import { CalendarRange, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function OrganizerEventsPage() {
  const { user, isHydrated } = useAuthStore();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated || !user) return;
    
    // We send organizerId to the backend so the API does the filtering.
    // (We removed the client-side filter because EventSummary doesn't contain creator IDs)
    eventService.list({ size: 100, organizerId: user.id } as any)
      .then((res: any) => {
        setEvents(res.content || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isHydrated, user]);

  if (!isHydrated || isLoading) {
    return <PublicShell><div className="flex h-[60vh] items-center justify-center"><Spinner /></div></PublicShell>;
  }

  return (
    <PublicShell>
      <main className="container-page py-10 space-y-8">
        <div className="anim-rise flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-fg">My <span className="text-gradient-brand">Events</span></h1>
            <p className="text-fg-secondary mt-1">Manage the events you have created.</p>
          </div>
          <Link href="/create-event">
            <Button variant="primary">
              <Plus className="size-4 mr-2" /> Create New Event
            </Button>
          </Link>
        </div>

        <div className="anim-rise delay-100">
          {events.length === 0 ? (
            <EmptyState 
              icon={<CalendarRange className="text-brand opacity-50" />} 
              title="No events yet" 
              description="You haven't created any events. Start hosting to build your community!" 
              action={<Link href="/create-event"><Button variant="outline">Create Event</Button></Link>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="relative group">
                  <EventCard event={event} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/organizer/events/${event.id}/edit`}>
                      <Button variant="secondary" size="sm" className="shadow-md">Edit Event</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}