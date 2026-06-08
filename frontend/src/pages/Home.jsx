import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] -z-10 pointer-events-none"></div>

      {/* Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-md shadow-indigo-500/20">
            HK
          </div>
          <span className="text-xl font-bold tracking-wider text-white">HireKarma</span>
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-24 text-center flex-grow flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-semibold mb-6 animate-pulse">
          <span>✨ Powered by Gemini AI Analysis</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl">
          Supercharge Your Job Search with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Automated Scraping</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          Aggregated search across LinkedIn, Naukri, Internshala, and Unstop. Built-in AI Resume parsing and match scoring to find high-compatibility SDE roles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to={token ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-indigo-500/25"
          >
            Start Scraping Free
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto border border-slate-850 hover:bg-slate-900/50 text-slate-300 hover:text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-200"
          >
            Explore Features
          </a>
        </div>

        {/* Feature Cards Grid */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-8 rounded-2xl text-left hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🕷️
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Platform Crawler</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Scrape and compile active job postings from top sources simultaneously using search keywords and target location filters.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-8 rounded-2xl text-left hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Match Score</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Upload your PDF resume to dynamically match your skillsets against job specifications, yielding compatability indicators instantly.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 p-8 rounded-2xl text-left hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              📈
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Application logs</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Organize your job search logs effortlessly. Trace date applied, company portal references, and application updates in real-time.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} HireKarma. Built for SDE-1 Assignment evaluation.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;