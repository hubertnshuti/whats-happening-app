import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div>
          <p className="text-lg font-bold text-gray-900">What&apos;s Happening</p>
          <p className="text-sm text-gray-500 mt-1">Discover events, join communities, and stay updated.</p>
        </div>
        <div className="flex space-x-6">
          <Link href="/events" className="text-sm text-gray-500 hover:text-black transition-colors">Events</Link>
          <Link href="/categories" className="text-sm text-gray-500 hover:text-black transition-colors">Categories</Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-black transition-colors">Login</Link>
        </div>
      </div>
    </footer>
  );
}