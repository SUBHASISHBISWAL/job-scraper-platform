import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, setUser } = useAuth();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    profile_image: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/profile/${user.id}`);
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await API.put(`/profile/${user.id}`, {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        skills: profile.skills
      });
      setStatus("Profile info updated successfully!");
      setUser({ ...user, name: profile.name });
    } catch (err) {
      console.error(err);
      setStatus("Failed to update profile info.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await API.post(`/profile/${user.id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile((prev) => ({ ...prev, profile_image: res.data.path }));
      setUser((prev) => ({ ...prev, profile_image: res.data.path }));
      alert("Profile image updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("Are you sure you want to delete your profile image?")) return;
    try {
      await API.delete(`/profile/${user.id}/image`);
      setProfile((prev) => ({ ...prev, profile_image: "" }));
      setUser((prev) => ({ ...prev, profile_image: "" }));
      alert("Profile image removed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile image.");
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".pdf")) {
      alert("Please upload a PDF format resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setParsingResume(true);
    setStatus("AI parser scanning resume keywords...");
    try {
      const res = await API.post("/ai/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile((prev) => ({ ...prev, skills: res.data.skills.join(", ") }));
      setStatus("Resume parsed! Key skills matched and loaded to your profile.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to parse resume PDF.");
    } finally {
      setParsingResume(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row md:pl-64">
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 space-y-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your professional bio, avatar, and resume skills</p>
        </div>

        {status && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm px-4 py-3 rounded-xl font-medium">
            ℹ️ {status}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8">
          {/* Avatar Controller */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
            <div className="relative group">
              <img
                src={profile.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-28 h-28 rounded-full border-2 border-indigo-500 object-cover bg-slate-950 shadow-md"
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-slate-950/70 rounded-full flex items-center justify-center text-xs text-white">
                  Loading...
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-center sm:text-left">
              <h3 className="font-bold text-white text-lg m-0">Profile Avatar</h3>
              <p className="text-slate-450 text-xs m-0">Supports PNG, JPG, or GIF up to 2MB</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <label className="cursor-pointer bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {profile.profile_image && (
                  <button
                    onClick={handleDeleteImage}
                    className="border border-red-500/35 hover:bg-red-500/10 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Delete Image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form details */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleFieldChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  className="w-full bg-slate-950/30 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleFieldChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location || ""}
                  onChange={handleFieldChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills Inventory</label>
              <textarea
                name="skills"
                rows="3"
                value={profile.skills || ""}
                onChange={handleFieldChange}
                placeholder="Python, React, FastAPI, Git, SQL..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-150 placeholder:text-slate-500"
              />
            </div>

            {/* Resume Upload widget */}
            <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-bold text-white text-sm m-0">Resume PDF Parse Assistant</p>
                <p className="text-xs text-slate-450 mt-1 m-0">
                  Upload your CV in PDF format to let the model parse SDE keyword capabilities.
                </p>
              </div>
              <label className={`cursor-pointer border border-indigo-500/35 hover:bg-indigo-500/10 text-indigo-400 text-xs font-bold px-5 py-3 rounded-xl transition-all ${parsingResume ? "opacity-50 pointer-events-none" : ""}`}>
                {parsingResume ? "AI Parsing..." : "Upload Resume"}
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-semibold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
              Update General Bio
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;