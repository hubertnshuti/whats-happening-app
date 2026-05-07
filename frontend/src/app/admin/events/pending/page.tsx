"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data for pending events
const MOCK_PENDING_EVENTS = [
  {
    id: "p1",
    title: "Underground Hacker Convention",
    organizer: "AnonUser99",
    category: "Technology",
    location: "Secret Basement, Kigali",
    date: "Dec 31, 2026",
    description: "Join us for an unrecorded session on bypassing modern security frameworks. Bring your own laptop and mask.",
    created: "2 hours ago"
  },
  {
    id: "p2",
    title: "Kigali Art & Wine Night",
    organizer: "Creative Hub RW",
    category: "Culture",
    location: "Inema Arts Center",
    date: "July 20, 2026",
    description: "An elegant evening of painting, wine tasting, and networking with local artists.",
    created: "1 day ago"
  }
];

export default function PendingEventsPage() {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const openRejectModal = (id: string) => {
    setSelectedEventId(id);
    setRejectModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/events" className="text-gray-500 hover:text-black">&larr; Back</Link>
          <h1 className="text-2xl font-bold text-gray-900">Pending Events</h1>
        </div>
        <p className="text-gray-500 text-sm mt-2">Review these newly submitted events before they go live on the platform.</p>
      </div>

      <div className="space-y-6">
        {MOCK_PENDING_EVENTS.map(event => (
          <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Submitted {event.created}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4 grid sm:grid-cols-2 gap-2">
                <p><span className="font-semibold text-gray-900">Organizer:</span> {event.organizer}</p>
                <p><span className="font-semibold text-gray-900">Category:</span> {event.category}</p>
                <p><span className="font-semibold text-gray-900">Location:</span> {event.location}</p>
                <p><span className="font-semibold text-gray-900">Date:</span> {event.date}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic border border-gray-100">
                "{event.description}"
              </div>
            </div>
            
            <div className="md:w-48 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <Link href={`/events/${event.id}`} className="w-full text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors">
                View Full Event
              </Link>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-green-700 transition-colors">
                Approve Event
              </button>
              <button onClick={() => openRejectModal(event.id)} className="w-full bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md font-medium text-sm hover:bg-red-100 transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Event</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this event. This will be sent to the organizer.</p>
            
            <textarea 
              rows={4} 
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-black focus:border-black mb-4"
              placeholder="e.g., This event violates our community guidelines regarding inappropriate content."
            ></textarea>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}