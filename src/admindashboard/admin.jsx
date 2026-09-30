import React from 'react';

function Dashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-blue-600 text-white w-64 flex-shrink-0 hidden md:block">
        <div className="p-4 flex items-center space-x-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.83c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
          </svg>
          <span className="text-xl font-bold">Flucca Admin</span>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-blue-200 text-sm font-medium">
            MAIN MENU
          </div>
          <a
            href="#"
            className="flex items-center px-4 py-3 bg-blue-700 text-white"
          >
            <i className="fas fa-tachometer-alt w-6" />
            <span>Dashboard</span>
          </a>
          <a
            href="#driver-applications"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-user-plus w-6" />
            <span>View New Driver Applications</span>
          </a>
          <a
            href="#trips-map"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-map-marked-alt w-6" />
            <span>View Trips on Map</span>
          </a>
          <a
            href="#complaints"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-exclamation-triangle w-6" />
            <span>Access Passenger & Driver Complaints</span>
          </a>
          <a
            href="#earnings"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-money-bill-wave w-6" />
            <span>View Daily/Monthly Earnings</span>
          </a>
          <a
            href="#faq"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-question-circle w-6" />
            <span>Edit FAQ, Terms, About Us</span>
          </a>
          <a
            href="#marketing"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-bullhorn w-6" />
            <span>Send Marketing Push Notifications</span>
          </a>
          <a
            href="#user-growth"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-chart-line w-6" />
            <span>User Growth & Route Demand</span>
          </a>
          <a
            href="#top-captains"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-star w-6" />
            <span>Top Rated Captains / Popular Trips</span>
          </a>
          <a
            href="#reports"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-file-alt w-6" />
            <span>Export Usage Reports</span>
          </a>
          <div className="px-4 py-2 text-blue-200 text-sm font-medium mt-6">
            ACCOUNT
          </div>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-cog w-6" />
            <span>Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-200 hover:bg-blue-500"
          >
            <i className="fas fa-sign-out-alt w-6" />
            <span>Logout</span>
          </a>
        </nav>
      </div>
      {/* Mobile Sidebar Toggle */}
      <div className="bg-blue-600 text-white w-full flex md:hidden items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.83c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
          </svg>
          <span className="text-xl font-bold">Flucca Admin</span>
        </div>
        <button className="text-white focus:outline-none">
          <i className="fas fa-bars text-xl" />
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between z-10 md:hidden">
          <h1 className="text-xl font-semibold text-blue-800">Dashboard</h1>
        </header>
        {/* Mobile Nav Menu (Hidden by default) */}
        <div className="md:hidden bg-blue-600 text-white absolute inset-y-0 left-0 transform -translate-x-full transition duration-200 ease-in-out w-64 z-30 hidden">
          {/* Mobile menu content here - duplicate of sidebar */}
        </div>
        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-blue-50 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-blue-800">Admin Dashboard</h1>
          </div>

          {/* Driver Applications Section */}
          <div id="driver-applications" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">View New Driver Applications</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("Check Info, Boat, License clicked")}
              >
                <i className="fas fa-check mr-2" /> Check Info, Boat, License
              </button>
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => alert("Approve Application clicked")}
                >
                  Approve Application
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => alert("Send Rejection + Reason clicked")}
                >
                  Send Rejection + Reason
                </button>
              </div>
            </div>
          </div>

          {/* Trips on Map Section */}
          <div id="trips-map" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">View Trips on Map</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("View Trips on Map clicked")}
              >
                <i className="fas fa-map-marked-alt mr-2" /> View Trips
              </button>
            </div>
          </div>

          {/* Complaints Section */}
          <div id="complaints" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">Access Passenger & Driver Complaints</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("Flag Issues: Delays, Complaints clicked")}
              >
                <i className="fas fa-exclamation-triangle mr-2" /> Flag Issues
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center hover:bg-blue-600"
                onClick={() => alert("Contact Involved Users clicked")}
              >
                <i className="fas fa-users mr-2" /> Contact Users
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center hover:bg-green-600"
                onClick={() => alert("Resolve & Archive Case clicked")}
              >
                <i className="fas fa-check-circle mr-2" /> Resolve & Archive
              </button>
            </div>
          </div>

          {/* Earnings Section */}
          <div id="earnings" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">View Daily/Monthly Earnings</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("View Daily/Monthly Earnings clicked")}
              >
                <i className="fas fa-money-bill-wave mr-2" /> View Earnings
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center hover:bg-blue-600"
                onClick={() => alert("View Platform Commission clicked")}
              >
                <i className="fas fa-percentage mr-2" /> View Commission
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center hover:bg-blue-600"
                onClick={() => alert("Driver Payouts / Balance Logs clicked")}
              >
                <i className="fas fa-wallet mr-2" /> Driver Payouts
              </button>
            </div>
          </div>

          {/* Additional Sections (FAQ, Marketing, User Growth, Top Captains, Reports) */}
          <div id="faq" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">Edit FAQ, Terms, About Us</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("Edit FAQ, Terms, About Us clicked")}
              >
                <i className="fas fa-edit mr-2" /> Edit Content
              </button>
            </div>
          </div>

          <div id="marketing" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">Send Marketing Push Notifications</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("Send Marketing Push Notifications clicked")}
              >
                <i className="fas fa-paper-plane mr-2" /> Send Notifications
              </button>
            </div>
          </div>

          <div id="user-growth" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">User Growth & Route Demand</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("User Growth & Route Demand clicked")}
              >
                <i className="fas fa-chart-line mr-2" /> View Data
              </button>
            </div>
          </div>

          <div id="top-captains" className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-4 px-6 border-b border-blue-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">Top Rated Captains / Popular Trips</h2>
            </div>
            <div className="p-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                onClick={() => alert("Top Rated Captains / Popular Trips clicked")}
              >
                <i className="fas fa-star mr-2" /> View Top Captains
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 flex items-center hover:bg-blue-600"
                onClick={() => alert("Export Usage Reports clicked")}
              >
                <i className="fas fa-file-export mr-2" /> Export Reports
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;