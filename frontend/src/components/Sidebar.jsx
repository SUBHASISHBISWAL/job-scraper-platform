import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Search Jobs", path: "/jobs", icon: "🔍" },
    { name: "Applications", path: "/history", icon: "📁" },
    { name: "My Profile", path: "/profile", icon: "👤" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-base font-extrabold shadow-lg shadow-indigo-500/20">
            HK
          </div>
          <span className="text-lg font-bold text-white tracking-wider">HireKarma</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl p-1 focus:outline-none">
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Collapsible Sidebar Container */}
      <aside className={`fixed left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between text-slate-300 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 overflow-y-auto`}>
        <div>
          {/* Logo & Brand Identity */}
          <div className="mb-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg font-extrabold shadow-md shadow-indigo-500/35">
              HK
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wider m-0">HireKarma</h1>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase block">SDE Scraper</span>
            </div>
          </div>

          {/* Links navigation list */}
          <nav className="space-y-1">
            {links.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-500/20"
                      : "hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-semibold text-sm">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Card Bottom Container */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-slate-700 object-cover"
            />
            <div className="truncate">
              <p className="text-sm font-bold text-white truncate m-0">{user?.name || "Active Session"}</p>
              <p className="text-xs text-slate-400 truncate m-0 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors duration-150 font-semibold text-sm"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
