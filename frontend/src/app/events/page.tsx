"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function CreateEventPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this is where the POST /events API call goes.
    // For now, we just show the success state.
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Event submitted!</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left inline-block">
          <p className="text-gray-700 text-lg mb-2">✅ Event created successfully and submitted for approval.</p>
          <p className="text-gray-700 text-lg">💬 An event forum has been created automatically.</p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/events" className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Back to Events
          </Link>
          <button onClick={() => setIsSubmitted(false)} className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Event</h1>
        <p className="text-gray-500 mt-2 text-lg">Fill in the details to publish your event on the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Basic Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input type="text" id="title" required placeholder="e.g., Kigali Tech Meetup" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select id="category" required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black bg-white">
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="music">Music</option>
                <option value="education">Education</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" required rows={5} placeholder="Describe your event in detail..." className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black"></textarea>
            </div>
          </div>
        </div>

        {/* 2. Location */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1">Venue / Location Name</label>
              <input type="text" id="locationName" required placeholder="e.g., Kigali Convention Centre" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" id="address" placeholder="e.g., KG 2 Roundabout" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" id="city" required placeholder="Kigali" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" id="country" required placeholder="Rwanda" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
          </div>
        </div>

        {/* 3. Date and Time */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Date and Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDatetime" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <input type="datetime-local" id="startDatetime" required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
            <div>
              <label htmlFor="endDatetime" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <input type="datetime-local" id="endDatetime" required className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
          </div>
        </div>

        {/* 4. Settings & Media */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Settings & Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select id="visibility" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black bg-white">
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">Max Attendees (Optional)</label>
              <input type="number" id="maxAttendees" placeholder="e.g., 200" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
            </div>
          </div>
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input type="url" id="coverImage" required placeholder="https://example.com/image.jpg" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <Link href="/events" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="bg-black text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors">
            Create Event
          </button>
        </div>

      </form>
    </div>
  );
}