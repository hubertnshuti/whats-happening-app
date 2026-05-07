import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
        Access Denied
      </h1>
      <p className="text-lg text-gray-500 max-w-md mx-auto mb-8">
        You do not have the necessary permissions to view this page. If you believe this is an error, please contact support.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
          Return to Home
        </Link>
        <Link href="/login" className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
          Log in with different account
        </Link>
      </div>
    </div>
  );
}