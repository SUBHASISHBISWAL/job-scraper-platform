import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center relative max-w-md space-y-6">
        <span className="text-8xl font-black text-indigo-500 tracking-wider">404</span>
        <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;