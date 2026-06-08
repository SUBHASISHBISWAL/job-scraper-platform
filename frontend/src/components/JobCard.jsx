function JobCard({
  title,
  company,
  location,
  platform,
}) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="text-gray-600 mt-2">
        Company: {company}
      </p>

      <p className="text-gray-600">
        Location: {location}
      </p>

      <p className="text-gray-600">
        Platform: {platform}
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;