import Link from 'next/link';

// Mock notification data
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Announcement in Kigali Tech Meetup",
    message: "The schedule for the event has been updated. Please check the forum for details.",
    type: "FORUM_ANNOUNCEMENT",
    time: "2 hours ago",
    isRead: false,
    link: "/events/1/forum"
  },
  {
    id: "2",
    title: "Event Approved",
    message: "Your event 'Startup Pitch Night' has been approved by admins and is now live.",
    type: "EVENT_APPROVED",
    time: "1 day ago",
    isRead: true,
    link: "/events/3"
  },
  {
    id: "3",
    title: "Question Answered",
    message: "An organizer has answered your question in the 'Creative Arts Workshop' forum.",
    type: "QUESTION_ANSWERED",
    time: "3 days ago",
    isRead: true,
    link: "/events/4/forum"
  }
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-2">Stay updated on your events and communities.</p>
        </div>
        <button className="text-sm font-medium text-black hover:underline">
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium">All</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">Unread</button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((notification) => (
          <Link 
            href={notification.link} 
            key={notification.id}
            className={`block p-4 sm:p-6 rounded-xl border transition-colors hover:bg-gray-50 ${notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50/50 border-blue-100'}`}
          >
            <div className="flex gap-4">
              {/* Icon based on read status */}
              <div className="mt-1 flex-shrink-0">
                {!notification.isRead ? (
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                ) : (
                  <div className="w-3 h-3 bg-gray-300 rounded-full mt-1.5"></div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h3 className={`text-base ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-black">
                  View details &rarr;
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
