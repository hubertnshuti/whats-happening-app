import Link from 'next/link';

// Mock user data
const MOCK_USER = {
  fullName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+250 780 000 000",
  location: "Kigali, Rwanda",
  bio: "Tech enthusiast, event lover, and software developer. Always looking for the next big hackathon or tech meetup.",
  roles: ["USER", "ORGANIZER"],
  accountStatus: "ACTIVE",
  stats: {
    saved: 12,
    liked: 45,
    created: 3,
    forums: 8
  }
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account and view your activity.</p>
        </div>
        <Link href="/profile/edit" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors inline-flex justify-center items-center">
          Edit Profile
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: User Info */}
        <div className="md:w-1/3">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 text-2xl font-bold">
              JD
            </div>
            <h2 className="text-xl font-bold text-gray-900">{MOCK_USER.fullName}</h2>
            <p className="text-sm text-gray-500 mb-4">{MOCK_USER.email}</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {MOCK_USER.roles.map(role => (
                <span key={role} className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {role}
                </span>
              ))}
            </div>

            <div className="text-left space-y-3 text-sm border-t border-gray-100 pt-4">
              <div>
                <span className="text-gray-500 block mb-1">Phone Number</span>
                <span className="text-gray-900 font-medium">{MOCK_USER.phoneNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Location</span>
                <span className="text-gray-900 font-medium">{MOCK_USER.location}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Bio</span>
                <p className="text-gray-900">{MOCK_USER.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Quick Links */}
        <div className="md:w-2/3 space-y-8">
          
          {/* Activity Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">My Event Activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl font-bold text-gray-900">{MOCK_USER.stats.saved}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Saved</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl font-bold text-gray-900">{MOCK_USER.stats.liked}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Liked</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl font-bold text-gray-900">{MOCK_USER.stats.forums}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Forums</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl font-bold text-gray-900">{MOCK_USER.stats.created}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Created</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/saved-events" className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                <span className="font-medium text-gray-900">View Saved Events</span>
                <span className="text-gray-400">&rarr;</span>
              </Link>
              <Link href="/notifications" className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                <span className="font-medium text-gray-900">View Notifications</span>
                <span className="text-gray-400">&rarr;</span>
              </Link>
              <button className="flex items-center justify-between p-4 hover:bg-red-50 rounded-lg border border-transparent transition-colors text-left w-full group">
                <span className="font-medium text-red-600">Log out</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}