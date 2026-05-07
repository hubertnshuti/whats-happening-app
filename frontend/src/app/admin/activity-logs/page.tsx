"use client";

import React from 'react';

// Mock data for Activity Logs
const MOCK_LOGS = [
  { id: "1", admin: "Sarah Admin", actionType: "APPROVE_EVENT", targetType: "EVENT", targetId: "e_101", description: "Approved event 'Kigali Tech Meetup'", date: "Today, 10:00 AM" },
  { id: "2", admin: "John Doe", actionType: "SUSPEND_USER", targetType: "USER", targetId: "u_404", description: "Suspended user 'SpammerAccount'", date: "Yesterday, 3:45 PM" },
  { id: "3", admin: "Sarah Admin", actionType: "CREATE_CATEGORY", targetType: "CATEGORY", targetId: "c_005", description: "Created new category 'Education'", date: "May 10, 2026, 9:00 AM" },
  { id: "4", admin: "Mike Admin", actionType: "DISMISS_REPORT", targetType: "REPORT", targetId: "r_022", description: "Dismissed report #022 for False Information", date: "May 09, 2026, 2:15 PM" },
];

export default function AdminActivityLogsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Audit trail of all administrative actions taken on the platform.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Action Type</label>
          <select className="border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-black focus:border-black text-sm bg-white min-w-[150px]">
            <option value="">All Actions</option>
            <option value="APPROVE_EVENT">Approve Event</option>
            <option value="REJECT_EVENT">Reject Event</option>
            <option value="SUSPEND_USER">Suspend User</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Target Type</label>
          <select className="border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-black focus:border-black text-sm bg-white min-w-[150px]">
            <option value="">All Targets</option>
            <option value="EVENT">Event</option>
            <option value="USER">User</option>
            <option value="CATEGORY">Category</option>
            <option value="REPORT">Report</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Admin User</label>
          <input type="text" placeholder="Search admin name..." className="border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-black focus:border-black text-sm" />
        </div>
        <button className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-1.5 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
          Clear Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Admin</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Action & Target</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Date/Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{log.admin}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase mr-2 border border-blue-100">
                      {log.actionType}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {log.targetType} ({log.targetId})
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{log.description}</td>
                  <td className="px-6 py-4 text-right text-gray-500 text-xs">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}