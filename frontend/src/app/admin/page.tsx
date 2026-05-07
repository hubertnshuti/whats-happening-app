import Link from 'next/link';

// Mock data for Admin Dashboard
const STATS = {
  totalUsers: 1254,
  totalEvents: 342,
  pendingEvents: 12,
  totalReports: 28,
  pendingReports: 5
};

const RECENT_ACTIVITY = [
  { id: 1, admin: "Sarah Admin", action: "APPROVE_EVENT", target: "EVENT (Kigali Tech Meetup)", date: "2 hours ago" },
  { id: 2, admin: "John Doe", action: "SUSPEND_USER", target: "USER (Spammer123)", date: "5 hours ago" },
  { id: 3, admin: "Sarah Admin", action: "CREATE_CATEGORY", target: "CATEGORY (Health & Wellness)", date: "1 day ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">A quick glance at platform metrics and recent activities.</p>
      </div>

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Total Users</p>
          <p className="text-3xl font-extrabold text-gray-900">{STATS.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Total Events</p>
          <p className="text-3xl font-extrabold text-gray-900">{STATS.totalEvents}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm text-center">
          <p className="text-xs text-yellow-700 font-bold uppercase tracking-wide mb-2">Pending Events</p>
          <p className="text-3xl font-extrabold text-yellow-700">{STATS.pendingEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Total Reports</p>
          <p className="text-3xl font-extrabold text-gray-900">{STATS.totalReports}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm text-center">
          <p className="text-xs text-red-700 font-bold uppercase tracking-wide mb-2">Pending Reports</p>
          <p className="text-3xl font-extrabold text-red-700">{STATS.pendingReports}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 2. Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/events/pending" className="block w-full bg-black text-white text-center px-4 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors">
                Review Pending Events
              </Link>
              <Link href="/admin/reports" className="block w-full bg-white border border-gray-300 text-gray-700 text-center px-4 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors">
                View Reports
              </Link>
              <Link href="/admin/categories" className="block w-full bg-white border border-gray-300 text-gray-700 text-center px-4 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors">
                Manage Categories
              </Link>
              <Link href="/admin/users" className="block w-full bg-white border border-gray-300 text-gray-700 text-center px-4 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors">
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Admin Activity</h2>
              <Link href="/admin/activity-logs" className="text-sm font-medium text-black hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {RECENT_ACTIVITY.map(log => (
                <div key={log.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">Target: {log.target}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">By {log.admin}</p>
                    <p className="text-xs text-gray-400">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}