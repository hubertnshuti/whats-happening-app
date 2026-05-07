"use client";

import React from 'react';

// Mock data for Categories
const MOCK_CATEGORIES = [
  { id: "1", name: "Technology", slug: "technology", description: "Tech meetups, hackathons, and conferences.", status: "ACTIVE", created: "Jan 01, 2026" },
  { id: "2", name: "Business", slug: "business", description: "Networking, pitch nights, and seminars.", status: "ACTIVE", created: "Jan 05, 2026" },
  { id: "3", name: "Culture", slug: "culture", description: "Festivals, art exhibitions, and traditional events.", status: "ACTIVE", created: "Feb 10, 2026" },
  { id: "4", name: "Spam Category", slug: "spam-category", description: "Created by mistake.", status: "DISABLED", created: "Mar 15, 2026" },
];

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Create and organize event categories.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Create Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create Category</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input type="text" placeholder="e.g., Sports" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} placeholder="Brief description..." className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black text-sm"></textarea>
              </div>
              <button type="button" className="w-full bg-black text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors">
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-left">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-700">Category Details</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_CATEGORIES.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex flex-col gap-1">
                        <div className="font-bold text-gray-900">{category.name} <span className="text-gray-400 font-normal text-xs ml-2">/{category.slug}</span></div>
                        <div className="text-gray-500 text-xs whitespace-normal">{category.description}</div>
                        <div className="text-gray-400 text-[10px]">Created: {category.created}</div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${category.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right align-top space-x-3">
                        <button className="text-blue-600 font-medium hover:underline text-xs">Edit</button>
                        {category.status === 'ACTIVE' ? (
                          <button className="text-red-600 font-medium hover:underline text-xs">Disable</button>
                        ) : (
                          <button className="text-green-600 font-medium hover:underline text-xs">Enable</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}