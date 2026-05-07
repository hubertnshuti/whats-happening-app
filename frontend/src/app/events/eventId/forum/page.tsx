"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data for the forum
const MOCK_FORUM = {
  eventId: "1",
  eventTitle: "Kigali Tech Meetup",
  status: "ACTIVE",
  memberCount: 124,
  messages: [
    {
      id: "m1",
      sender: "John Doe",
      role: "ORGANIZER",
      type: "ANNOUNCEMENT",
      content: "Welcome everyone! We are thrilled to host you tomorrow. Please make sure to arrive by 9:30 AM for registration and coffee.",
      date: "Today at 10:00 AM",
      isPinned: true,
      reactions: { like: 12, love: 5, important: 8, thanks: 15 }
    },
    {
      id: "m2",
      sender: "Sarah Admin",
      role: "FORUM_ADMIN",
      type: "UPDATE",
      content: "The parking lot at the main entrance is currently full. Please use the secondary parking on the East wing.",
      date: "Today at 1:15 PM",
      isPinned: false,
      reactions: { like: 2, thanks: 8 }
    }
  ],
  questions: [
    {
      id: "q1",
      user: "Alice K.",
      text: "Will there be vegetarian food options available during lunch?",
      status: "ANSWERED",
      answer: "Yes, Alice! We have a dedicated vegetarian and vegan section.",
      answeredBy: "John Doe"
    },
    {
      id: "q2",
      user: "Michael R.",
      text: "Is it possible to get a recording of the sessions afterwards?",
      status: "PENDING",
      answer: null,
      answeredBy: null
    }
  ]
};

export default function EventForumPage({ params }: { params: { eventId: string } }) {
  const [questionText, setQuestionText] = useState("");

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* 1. Forum Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase">{MOCK_FORUM.status}</span>
              <span className="text-sm text-gray-500 font-medium">{MOCK_FORUM.memberCount} Members</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">{MOCK_FORUM.eventTitle} - Forum</h1>
          </div>
          <div className="flex gap-3">
            <Link href={`/events/${MOCK_FORUM.eventId}`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              View Event
            </Link>
            <button className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors">
              Leave Forum
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed (Announcements) */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* Admin Message Composer (Visible only to Organizers/Admins) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm border-l-4 border-l-black">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Post Announcement (Admin Only)</h2>
              <div className="space-y-4">
                <textarea 
                  rows={3} 
                  placeholder="Type an announcement, update, or reminder..." 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                ></textarea>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <select className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-black focus:border-black bg-white">
                      <option value="ANNOUNCEMENT">Announcement</option>
                      <option value="UPDATE">Update</option>
                      <option value="REMINDER">Reminder</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="rounded text-black focus:ring-black" />
                      Pin
                    </label>
                  </div>
                  <button className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4">
              {MOCK_FORUM.messages.map((msg) => (
                <div key={msg.id} className={`bg-white border ${msg.isPinned ? 'border-yellow-300 shadow-md' : 'border-gray-200 shadow-sm'} rounded-xl p-6`}>
                  
                  {msg.isPinned && (
                    <div className="flex items-center gap-1 text-yellow-600 text-xs font-bold uppercase mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                      Pinned Message
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                        {msg.sender.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{msg.sender}</h3>
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{msg.role}</span>
                        </div>
                        <p className="text-xs text-gray-500">{msg.date}</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-semibold border border-blue-100">
                      {msg.type}
                    </span>
                  </div>

                  <p className="text-gray-800 text-base leading-relaxed mb-6 whitespace-pre-line">
                    {msg.content}
                  </p>

                  {/* Reactions Bar */}
                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    <button className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      👍 {msg.reactions.like || 0}
                    </button>
                    <button className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      ❤️ {msg.reactions.love || 0}
                    </button>
                    <button className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      ❗ {msg.reactions.important || 0}
                    </button>
                    <button className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 transition-colors">
                      🙏 {msg.reactions.thanks || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar (Questions) */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-36">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Q&A Space</h2>
              <p className="text-sm text-gray-500 mb-6">Ask the organizers a question. Answers will be visible to everyone.</p>
              
              {/* Ask Question Form */}
              <div className="mb-8">
                <textarea 
                  rows={2} 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask a question..." 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-black focus:border-black mb-2"
                ></textarea>
                <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors">
                  Submit Question
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Recent Questions</h3>
                
                {MOCK_FORUM.questions.map((q) => (
                  <div key={q.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">"{q.text}"</p>
                    <p className="text-xs text-gray-500 mb-3">— Asked by {q.user}</p>
                    
                    {q.status === "ANSWERED" ? (
                      <div className="bg-white border border-green-200 rounded p-3 relative">
                        <span className="absolute -top-2 -left-2 bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Answer</span>
                        <p className="text-sm text-gray-700 mt-1">{q.answer}</p>
                        <p className="text-xs text-gray-400 mt-2">By {q.answeredBy}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600 text-xs font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Pending Answer
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}