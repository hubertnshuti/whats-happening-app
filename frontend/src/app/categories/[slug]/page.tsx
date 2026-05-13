'use client';

import { use, useEffect, useState } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { eventsService } from '@/features/events/service';
import { categoriesService } from '@/features/categories/service';
import { EventCard } from '@/features/events/components/EventCard';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import Link from 'next/link';
import { ArrowLeft, CalendarX } from 'lucide-react';

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [category, setCategory] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get all categories to find the name/desc matching this slug
        const cats = await categoriesService.list();
        const found = cats.find(c => c.slug === slug);
        setCategory(found || { name: slug.replace('-', ' '), description: '' });

        // 2. Fetch events for this category
        const res = await eventsService.list({ category: slug, page: 0, size: 50 });
        setEvents(res.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (isLoading) {
    return <PublicShell><div className="flex h-[60vh] items-center justify-center"><Spinner /></div></PublicShell>;
  }

  return (
    <PublicShell>
      <main className="container-page py-8 space-y-10">
        
        {/* Hero */}
        <div className="anim-rise space-y-4 max-w-3xl">
          <Link href="/categories" className="inline-flex items-center text-sm font-medium text-fg-muted hover:text-brand transition-colors">
            <ArrowLeft className="size-4 mr-1" /> All Categories
          </Link>
          <h1 className="font-display text-4xl font-bold tracking-tight text-fg capitalize">
            {category?.name} <span className="text-gradient-brand">Events</span>
          </h1>
          {category?.description && (
            <p className="text-lg text-fg-secondary">{category.description}</p>
          )}
        </div>

        {/* Event Grid */}
        <div className="anim-rise delay-100">
          {events.length === 0 ? (
            <EmptyState 
              icon={<CalendarX className="opacity-50 text-brand" />}
              title="No events yet" 
              description={`There are currently no upcoming events in the ${category?.name} category.`} 
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}