import Link from 'next/link';

export default function EditProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information and bio.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <form action="#" method="POST" className="space-y-6">
          
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              id="fullName" 
              defaultValue="John Doe"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input 
              type="text" 
              name="location" 
              id="location" 
              defaultValue="Kigali, Rwanda"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
            <input 
              type="url" 
              name="profileImage" 
              id="profileImage" 
              placeholder="https://example.com/my-photo.jpg"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea 
              id="bio" 
              name="bio" 
              rows={4} 
              defaultValue="Tech enthusiast, event lover, and software developer. Always looking for the next big hackathon or tech meetup."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">Brief description for your profile. URLs are hyperlinked.</p>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6 mt-6">
            <Link href="/profile" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Save Changes
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}