import { useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Microsoft",
    location: "Hyderabad",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Amazon",
    location: "Pune",
  },
];

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Find Your Dream Job
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Search thousands of jobs from top companies.
        </p>

        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Explore Jobs
        </button>

        <div className="max-w-3xl mx-auto mt-10 flex gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-3 rounded-lg"
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </div>

        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;