import Link from 'next/link';

// Defining the shape of our event data for the component
export interface EventProps {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  likes: number;
}

export default function EventCard({ event }: { event: EventProps }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-200 w-full relative">
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
          {event.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{event.title}</h3>
        </div>
        
        <div className="text-sm text-gray-500 mb-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">
          {event.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-500 hover:text-red-500 cursor-pointer transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span className="text-sm font-medium">{event.likes}</span>
          </div>
          <Link href={`/events/${event.id}`} className="text-sm font-semibold text-black hover:underline">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}