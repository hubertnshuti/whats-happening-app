import Link from 'next/link';
import EventCard from '@/components/EventCard';

// Temporary dummy data so we can see our layout working
const DUMMY_EVENTS = [
  {
    id: "1",
    title: "Kigali Tech Meetup",
    category: "Technology",
    location: "Kigali Convention Centre",
    date: "May 20, 2026 • 10:00 AM",
    description: "A major gathering for tech enthusiasts and developers to discuss the future of AI and web development.",
    likes: 124
  },
  {
    id: "2",
    title: "Rwanda Cultural Festival",
    category: "Culture",
    location: "Kigali Arena",
    date: "June 5, 2026 • 2:00 PM",
    description: "Experience the vibrant traditions, music, and food of Rwanda in this all-day cultural celebration.",
    likes: 342
  },
  {
    id: "3",
    title: "Startup Pitch Night",
    category: "Business",
    location: "Norrsken House Kigali",
    date: "June 12, 2026 • 6:00 PM",
    description: "Watch local founders pitch their innovative ideas to a panel of international investors.",
    likes: 89
  }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      
      {/* 1. Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          Discover what’s happening <br className="hidden md:block" /> around you
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Find events, join communities, and stay updated through event forums.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Link href="/events" className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
            Browse Events
          </Link>
          <Link href="/events/create" className="bg-white text-black border border-gray-300 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
            Create Event
          </Link>
        </div>

        {/* Search Bar Placeholder */}
        <div className="max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search events by name, category, or location..." 
            className="w-full border border-gray-300 rounded-md py-4 px-6 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
          />
        </div>
      </section>

      {/* 2. Featured Events Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 mt-2">Don't miss out on what's happening soon.</p>
          </div>
          <Link href="/events" className="hidden sm:block text-black font-semibold hover:underline">
            View all &rarr;
          </Link>
        </div>
        
        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_EVENTS.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        <Link href="/events" className="sm:hidden block text-center mt-8 text-black font-semibold hover:underline">
          View all events &rarr;
        </Link>
      </section>

      {/* 3. How It Works Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Discover events</h3>
              <p className="text-gray-500">Search and filter to find the perfect events happening near you.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Save or join forum</h3>
              <p className="text-gray-500">Bookmark events you like or join the event forum to connect.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Receive updates</h3>
              <p className="text-gray-500">Get announcements and reminders directly from the organizers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call to Action Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Want to share your event?</h2>
        <Link href="/events/create" className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
          Create Event
        </Link>
      </section>

    </div>
  );
}