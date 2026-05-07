"use client";

import React, { useState } from 'react';

// Mock user data
const MOCK_USERS = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+250 780 000 001", roles: ["USER", "ORGANIZER"], status: "ACTIVE", joined: "Jan 10, 2026" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+250 780 000 002", roles: ["USER"], status: "ACTIVE", joined: "Feb 05, 2026" },
  { id: "3", name: "Spammer Account", email: "spam@fake.com", phone: "-", roles: ["USER"], status: "SUSPENDED", joined: "May 01, 2026" },
  { id: "4", name: "Sarah Admin", email: "sarah@whatshappening.com", phone: "+250 780 000 004", roles: ["ADMIN", "USER"], status: "ACTIVE", joined: "Jan 01, 2026" },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm mt-1">View, search, and manage platform users.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm w-full sm:w-64"
          />
          <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm bg-white">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Contact Info</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Roles</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 text-xs">Joined {user.joined}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{user.email}</div>
                    <div className="text-gray-500 text-xs">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map(role => (
                        <span key={role} className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.status === 'ACTIVE' ? (
                      <button className="text-red-600 font-medium hover:underline border border-red-200 bg-red-50 px-3 py-1 rounded text-xs transition-colors">Suspend</button>
                    ) : (
                      <button className="text-green-600 font-medium hover:underline border border-green-200 bg-green-50 px-3 py-1 rounded text-xs transition-colors">Activate</button>
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