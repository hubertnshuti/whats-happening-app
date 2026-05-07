import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="text-xl font-bold tracking-tight">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">Dashboard</Link>
          <Link href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">Users</Link>
          <Link href="/admin/events" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">Events</Link>
          <Link href="/admin/events/pending" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium text-yellow-400 transition-colors">Pending Events</Link>
          <Link href="/admin/reports" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">Reports</Link>
          <Link href="/admin/categories" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">Categories</Link>
          <Link href="/admin/activity-logs" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">Activity Logs</Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="block px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors text-gray-300">
            &larr; Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10">
          <div className="md:hidden font-bold text-lg">Admin Panel</div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Admin User</span>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
      
    </div>
  );
}