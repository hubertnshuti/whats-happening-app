'use client';

import { useEffect, useState } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
import { categoryService } from '@/features/categories/service';
import { Spinner, EmptyState } from '@/components/ui/feedback';
import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryService.list()
      .then(res => setCategories(res))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <PublicShell>
      <main className="container-page py-12 space-y-8">
        <div className="anim-rise text-center max-w-2xl mx-auto space-y-4">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Explore by <span className="text-gradient-brand">Category</span>
          </h1>
          <p className="text-fg-secondary text-lg">
            Find exactly what you're looking for, from academic workshops to weekend sports.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : categories.length === 0 ? (
          <EmptyState icon={<LayoutGrid />} title="No categories found" description="Check back later for new categories." />
        ) : (
          <div className="anim-rise delay-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {categories.map((cat, idx) => (
              <Link 
                key={cat.id} 
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col p-6 rounded-2xl bg-surface border border-line hover:border-brand hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle background glow on hover */}
                <div className="absolute -right-12 -top-12 size-32 bg-brand/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="font-display font-bold text-xl text-fg group-hover:text-brand transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-fg-secondary line-clamp-2 mb-6 flex-1">
                  {cat.description || `Discover events related to ${cat.name}.`}
                </p>
                <div className="flex items-center text-sm font-semibold text-brand mt-auto">
                  Browse events <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicShell>
  );
}