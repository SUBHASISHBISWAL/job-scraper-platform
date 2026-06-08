import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">
            HireKarma
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Jobs
          </Link>

          <Link
            to="/history"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            History
          </Link>

          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Profile
          </Link>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;