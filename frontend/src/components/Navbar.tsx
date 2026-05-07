import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
              What&apos;s Happening
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Events
            </Link>
          </div>

          {/* Auth Actions (Guest State) */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}