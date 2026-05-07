"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock events data
const MOCK_EVENTS = [
  { id: "1", title: "Kigali Tech Meetup", organizer: "John Doe", category: "Technology", city: "Kigali", date: "May 20, 2026", status: "APPROVED" },
  { id: "2", title: "Rwanda Cultural Festival", organizer: "Jane Smith", category: "Culture", city: "Kigali", date: "June 5, 2026", status: "APPROVED" },
  { id: "3", title: "Suspicious Crypto Seminar", organizer: "Spammer Account", category: "Business", city: "Rubavu", date: "July 10, 2026", status: "CANCELLED" },
];

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-500 text-sm mt-1">View all events on the platform.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm w-full sm:w-64"
          />
          <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm bg-white">
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Event Title</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Organizer</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Location & Date</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-gray-500 text-xs">{event.category}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {event.organizer}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{event.city}</div>
                    <div className="text-gray-500 text-xs">{event.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      event.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      event.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/events/${event.id}`} className="text-black font-medium hover:underline text-xs">View</Link>
                    {event.status !== 'CANCELLED' && (
                      <button className="text-red-600 font-medium hover:underline text-xs">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}