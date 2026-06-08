import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function ApplicationHistory() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [search, statusFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await API.get("/applications/", { params });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row md:pl-64">
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Application Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">
            Logs and trace states of all jobs applied to via the platform search index
          </p>
        </div>

        {/* Query & Filter Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search by role or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-xs bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
          />

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["", "Applied", "Interviewing", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  statusFilter === status
                    ? "bg-indigo-650 text-white border-indigo-600 shadow-md shadow-indigo-500/10"
                    : "bg-slate-950 text-slate-450 hover:text-slate-200 border-slate-800"
                }`}
              >
                {status || "All Statuses"}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-950 rounded-xl border border-slate-850"></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl">📁</span>
              <p className="text-slate-400 text-sm mt-4">
                No logs matching your query. Scrape and click Apply to add records.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs font-bold uppercase text-slate-400 border-b border-slate-850">
                  <tr>
                    <th className="pb-3 font-semibold">Job Title</th>
                    <th className="pb-3 font-semibold">Company</th>
                    <th className="pb-3 font-semibold">Platform</th>
                    <th className="pb-3 font-semibold">Date Applied</th>
                    <th className="pb-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-950/25 transition-colors">
                      <td className="py-4 font-semibold text-white max-w-[200px] truncate">
                        <a href={app.job_link} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                          {app.job_title} <span className="text-xs text-indigo-400">↗</span>
                        </a>
                      </td>
                      <td className="py-4 truncate max-w-[150px]">{app.company}</td>
                      <td className="py-4">
                        <span className="bg-slate-950 text-slate-350 px-2.5 py-1 rounded-lg text-xs font-mono border border-slate-800">
                          {app.platform}
                        </span>
                      </td>
                      <td className="py-4 text-xs font-mono text-slate-450">
                        {new Date(app.applied_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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
      </main>
    </div>
  );
}

export default ApplicationHistory;