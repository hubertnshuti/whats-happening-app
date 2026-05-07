"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data for Reports
const MOCK_REPORTS = [
  { id: "r1", event: "Suspicious Crypto Seminar", reportedBy: "Jane Smith", reason: "SPAM", description: "They are just trying to sell fake coins.", status: "PENDING", date: "2 hours ago" },
  { id: "r2", event: "Underground Hacker Convention", reportedBy: "John Doe", reason: "INAPPROPRIATE_CONTENT", description: "Seems like an illegal gathering.", status: "REVIEWED", date: "1 day ago" },
  { id: "r3", event: "Kigali Tech Meetup", reportedBy: "AngryUser", reason: "WRONG_INFORMATION", description: "The time is actually 11 AM, not 10 AM.", status: "ACTION_TAKEN", date: "3 days ago" },
];

export default function AdminReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage events flagged by the community.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Search event title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm w-full sm:w-48"
          />
          <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm bg-white">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ACTION_TAKEN">Action Taken</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
          <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm bg-white">
            <option value="">All Reasons</option>
            <option value="SPAM">Spam</option>
            <option value="FAKE_EVENT">Fake Event</option>
            <option value="INAPPROPRIATE_CONTENT">Inappropriate</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Reported Event</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Reason / Details</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Reported By</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{report.event}</div>
                    <Link href={`/events/${report.id}`} className="text-blue-600 hover:underline text-xs">View Event &rarr;</Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-1 inline-block">
                      {report.reason}
                    </span>
                    <p className="text-gray-600 text-xs truncate max-w-[200px]" title={report.description}>
                      "{report.description}"
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{report.reportedBy}</div>
                    <div className="text-gray-500 text-xs">{report.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'ACTION_TAKEN' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {report.status === 'PENDING' && (
                      <>
                        <button className="text-gray-600 font-medium hover:text-black border border-gray-300 bg-white px-2 py-1 rounded text-xs">Dismiss</button>
                        <button className="text-white font-medium bg-black hover:bg-gray-800 px-2 py-1 rounded text-xs">Mark Action Taken</button>
                      </>
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