'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PublicShell } from '@/components/layout/PublicShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/features/events/components/EventCard';
import { EmptyState, Spinner } from '@/components/ui/feedback';
import { eventsService } from '@/features/events/service';
import { categoriesService } from '@/features/categories/service';
import { Search, Loader2, Clock, X, Compass } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
    
    categoriesService.list().then(res => setCategories(res.slice(0, 6))).catch(console.error);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;
    
    setQuery(q);
    setIsSearching(true);
    
    // Save to recents
    const updatedRecents = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updatedRecents);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecents));

    try {
      const res = await eventsService.list({ search: q, page: 0, size: 20 });
      setResults(res.content);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <PublicShell>
      <main className="container-page py-12 max-w-4xl mx-auto space-y-12">
        {/* Search Header */}
        <div className="anim-rise space-y-6 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-fg">
            Find <span className="text-gradient-brand">your next experience</span>
          </h1>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
            className="relative max-w-2xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-fg-muted" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for workshops, matches, talks..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-surface border border-line focus:border-brand outline-none transition-all text-lg shadow-sm"
              />
            </div>
            <Button type="submit" variant="primary" className="h-14 px-8 rounded-2xl">
              {isSearching ? <Loader2 className="size-5 animate-spin" /> : 'Search'}
            </Button>
          </form>
        </div>

        {/* Results Area */}
        <div className="anim-rise delay-100">
          {isSearching && (
            <div className="flex justify-center py-20"><Spinner /></div>
          )}

          {!isSearching && results !== null && results.length === 0 && (
            <EmptyState 
              icon={<Compass className="opacity-50 text-brand" />}
              title="No events found"
              description={`We couldn't find anything matching "${query}". Try a different keyword or browse categories.`}
              action={<Button variant="outline" onClick={() => router.push('/categories')}>Browse Categories</Button>}
            />
          )}

          {!isSearching && results !== null && results.length > 0 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold">Results for "{query}"</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Idle State: Recents & Suggestions */}
          {!isSearching && results === null && (
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              {recentSearches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-fg">Recent Searches</h3>
                    <button onClick={clearRecents} className="text-xs text-fg-muted hover:text-danger transition-colors">Clear all</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {recentSearches.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSearch(s)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface border border-transparent hover:border-line text-left transition-all"
                      >
                        <Clock className="size-4 text-fg-muted" />
                        <span className="text-fg-secondary">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-display font-bold text-fg">Suggested Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/categories/${cat.slug}`}
                      className="px-4 py-2 bg-surface border border-line rounded-pill text-sm font-medium text-fg hover:border-brand hover:text-brand transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PublicShell>
  );
}