import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Jobs() {
  const [keyword, setKeyword] = useState("Frontend Developer");
  const [location, setLocation] = useState("Bangalore");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/ai/recommend", {
        keyword,
        location
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch jobs. Please verify backend status.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      await API.post("/applications/apply", {
        job_title: job.title,
        company: job.company,
        platform: job.platform,
        job_link: job.job_link,
        status: "Applied"
      });
      
      window.open(job.job_link, "_blank", "noopener,noreferrer");
      alert(`Applied and logged application to: ${job.company}`);
    } catch (err) {
      console.error(err);
      alert("Failed to register application log.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row md:pl-64">
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Job Crawler</h1>
          <p className="text-slate-400 text-sm mt-1">
            Search keyword criteria and scrape active positions from multiple portals in real-time
          </p>
        </div>

        {/* Query Form */}
        <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Job Keyword</label>
            <input
              type="text"
              placeholder="e.g. React Developer"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
            <input
              type="text"
              placeholder="e.g. Pune"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-600/55 text-white font-semibold rounded-xl py-3.5 text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98]"
            >
              {loading ? "Scraping Portals..." : "🕷️ Scrape Jobs"}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Results Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 m-0">Scraped Results</h2>

          {loading ? (
            /* Skeleton list */
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-950 rounded-xl border border-slate-850"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl">🕸️</span>
              <p className="text-slate-400 text-sm mt-4">
                No crawler results present. Fill in your criteria above and click Scrape.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs font-bold uppercase text-slate-400 border-b border-slate-850">
                  <tr>
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Company</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Platform</th>
                    <th className="pb-3 font-semibold">Match Score</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {jobs.map((job, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/20 transition-colors">
                      <td className="py-4 font-semibold text-white max-w-[200px] truncate">{job.title}</td>
                      <td className="py-4 max-w-[150px] truncate">{job.company}</td>
                      <td className="py-4 text-slate-300">{job.location}</td>
                      <td className="py-4">
                        <span className="bg-slate-950 text-slate-350 px-2.5 py-1 rounded-lg text-xs font-mono border border-slate-800">
                          {job.platform}
                        </span>
                      </td>
                      <td className="py-4">
                        {job.match_score !== undefined ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            job.match_score >= 75 ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            job.match_score >= 50 ? "bg-amber-500/10 text-amber-450 border border-amber-500/20" :
                            "bg-slate-950 text-slate-400 border border-slate-800"
                          }`}>
                            {job.match_score}%
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleApply(job)}
                          className="bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm active:scale-[0.97]"
                        >
                          Apply Now
                        </button>
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

export default Jobs;