import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [status] = useState("System Healthy");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row md:pl-64">
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 space-y-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure your personal preferences and system notifications</p>
        </div>

        {/* Options box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 divide-y divide-slate-800/60">
          {/* Switch 1 */}
          <div className="py-5 flex items-center justify-between first:pt-0">
            <div>
              <p className="font-semibold text-white m-0 text-sm">Dark Theme Mode</p>
              <p className="text-xs text-slate-450 mt-1 m-0">Toggle between light and dark display preferences</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                darkMode ? "bg-indigo-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 transform ${
                  darkMode ? "translate-x-5.5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Switch 2 */}
          <div className="py-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white m-0 text-sm">Email Match Alerts</p>
              <p className="text-xs text-slate-450 mt-1 m-0">Receive weekly compatible crawler listings directly in your inbox</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                emailNotifications ? "bg-indigo-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 transform ${
                  emailNotifications ? "translate-x-5.5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Status Label */}
          <div className="py-5 flex items-center justify-between last:pb-0">
            <div>
              <p className="font-semibold text-white m-0 text-sm">Scraper Backend Connection</p>
              <p className="text-xs text-slate-450 mt-1 m-0">Active execution status of the API services pipeline</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-green-500/10 text-green-450 border border-green-500/20 rounded-full">
              ● {status}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
