import Link from 'next/link';

// Mock data for a single event
const MOCK_EVENT = {
  id: "1",
  title: "Kigali Tech Meetup",
  category: "Technology",
  status: "APPROVED",
  locationName: "Kigali Convention Centre",
  address: "KG 2 Roundabout",
  city: "Kigali",
  country: "Rwanda",
  startDatetime: "May 20, 2026 • 10:00 AM",
  endDatetime: "May 20, 2026 • 3:00 PM",
  organizer: "John Doe",
  description: "Join us for the biggest gathering of tech enthusiasts, developers, and founders in Rwanda. We will discuss the future of AI, web development trends, and how local startups can scale globally. Expect great networking opportunities, insightful panels, and hands-on workshops.",
  likes: 124,
  saves: 45,
  forumMembers: 82
};

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  return (
    <div className="pb-20">
      {/* 1. Event Cover Image Placeholder */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-gray-200 relative">
        <div className="absolute top-6 left-6 max-w-7xl mx-auto px-4 w-full">
          <Link href="/events" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-medium hover:bg-white transition-colors shadow-sm inline-flex items-center gap-2">
            &larr; Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area (Left Side) */}
          <div className="lg:w-2/3">
            {/* Header Info */}
            <div className="mb-8">
              <div className="flex gap-2 mb-3 text-sm">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">{MOCK_EVENT.category}</span>
                <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">{MOCK_EVENT.status}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{MOCK_EVENT.title}</h1>
              <p className="text-gray-500 font-medium text-lg">Organized by {MOCK_EVENT.organizer}</p>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {MOCK_EVENT.description}
              </p>
            </div>

            {/* Event Media Gallery */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48 bg-gray-100 rounded-lg border border-gray-200"></div>
                <div className="h-48 bg-gray-100 rounded-lg border border-gray-200"></div>
              </div>
            </div>

            {/* Forum Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Event Forum</h3>
              <p className="text-gray-600 mb-6">Join {MOCK_EVENT.forumMembers} others to get announcements and ask questions.</p>
              <Link href={`/events/${MOCK_EVENT.id}/forum`} className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                Open Forum
              </Link>
            </div>
          </div>

          {/* Sidebar / Actions (Right Side) */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
              
              {/* Date & Time */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Date & Time</h3>
                <p className="text-gray-700">{MOCK_EVENT.startDatetime}</p>
                <p className="text-gray-500 text-sm">to {MOCK_EVENT.endDatetime}</p>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Location</h3>
                <p className="text-gray-900 font-medium">{MOCK_EVENT.locationName}</p>
                <p className="text-gray-600">{MOCK_EVENT.address}</p>
                <p className="text-gray-600">{MOCK_EVENT.city}, {MOCK_EVENT.country}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-black text-white px-4 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  Join Forum
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  Save Event ({MOCK_EVENT.saves})
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Like ({MOCK_EVENT.likes})
                  </button>
                </div>
              </div>

              {/* Meta Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                <Link href={`/events/${MOCK_EVENT.id}/report`} className="text-sm text-red-500 hover:underline">
                  Report this event
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}