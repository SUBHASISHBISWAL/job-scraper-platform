import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    applied: 0,
    interviewing: 0,
    rejected: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your HireKarma Career Companion. Ask me about SDE resume tips, matching jobs, or interview questions today!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMsg) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setSendingMsg(true);

    try {
      const res = await API.post("/ai/chat", { message: userText });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to AI advisor." }]);
    } finally {
      setSendingMsg(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/applications/");
      const apps = res.data;
      setRecentApps(apps.slice(0, 5));

      const appliedCount = apps.filter((a) => a.status === "Applied").length;
      const interviewCount = apps.filter((a) => a.status === "Interviewing" || a.status === "Pending").length;
      const rejectedCount = apps.filter((a) => a.status === "Rejected").length;

      setMetrics({
        totalApplications: apps.length,
        applied: appliedCount,
        interviewing: interviewCount,
        rejected: rejectedCount,
      });
    } catch (err) {
      console.error("Failed to load dashboard statistics", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row md:pl-64">
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time statistics of your active job searches</p>
          </div>
          <Link
            to="/jobs"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-150 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            🔍 Search & Scrape Jobs
          </Link>
        </div>

        {loading ? (
          /* Metric Skeleton loaders */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          /* Real-time Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all duration-200 hover:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Total Applications</span>
              <p className="text-4xl font-extrabold text-white mt-3 m-0">{metrics.totalApplications}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all duration-200 hover:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Applied</span>
              <p className="text-4xl font-extrabold text-indigo-400 mt-3 m-0">{metrics.applied}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all duration-200 hover:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Interviewing</span>
              <p className="text-4xl font-extrabold text-amber-400 mt-3 m-0">{metrics.interviewing}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all duration-200 hover:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Rejected</span>
              <p className="text-4xl font-extrabold text-red-400 mt-3 m-0">{metrics.rejected}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications tracker log */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white m-0">Recent Applications</h2>
              <Link to="/history" className="text-indigo-400 hover:text-indigo-350 text-sm font-semibold transition-colors">
                View All Tracker Logs →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-950 rounded-xl border border-slate-800"></div>
                ))}
              </div>
            ) : recentApps.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl">📁</span>
                <p className="text-slate-400 text-sm mt-3">No applications found. Scrape and apply to add records!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs font-bold uppercase text-slate-400 border-b border-slate-850">
                    <tr>
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 font-semibold">Company</th>
                      <th className="pb-3 font-semibold">Platform</th>
                      <th className="pb-3 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {recentApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-4 font-medium text-white truncate max-w-[160px]">{app.job_title}</td>
                        <td className="py-4 truncate max-w-[130px]">{app.company}</td>
                        <td className="py-4">
                          <span className="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-mono border border-slate-800">
                            {app.platform}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            app.status === "Applied" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                            app.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Interactive AI Chatbot Sidepanel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[500px]">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-2 m-0">Gemini AI Advisor</h2>
                <p className="text-slate-450 text-xs mt-0.5 mb-4 leading-relaxed">Ask SDE resume or career questions directly below:</p>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-1 text-xs max-h-[260px] text-left">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2.5 leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-slate-950 text-white border border-slate-800"
                        : "bg-indigo-950/40 text-indigo-300 border border-indigo-900/35"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {sendingMsg && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl px-3 py-2.5 bg-indigo-950/40 text-indigo-400 border border-indigo-900/35 animate-pulse">
                      Gemini is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input section */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about resume skills, SDE prep..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled={sendingMsg}
                  required
                />
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold px-3 rounded-xl text-xs transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
