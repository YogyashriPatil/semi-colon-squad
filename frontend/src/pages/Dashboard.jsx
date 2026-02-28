import CreateProject from "../components/CreateProject";
import logo from "../assets/logo.jpeg";
import heroVideo from "../assets/video.mp4";
import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="px-10 pt-10 pb-10 text-white relative">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-10">

        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="w-28 h-auto object-contain"
        />

        {/* Profile */}
        <div className="
          w-10 h-10
          flex items-center justify-center
          rounded-full
          border border-white/20
          bg-black/40
          backdrop-blur-md
          cursor-pointer
          hover:scale-110
          transition
        ">
          <User size={40} />
        </div>

      </div>


      {/* HERO SECTION */}
      <div className="flex gap-10 items-center min-h-[60vh]">

        {/* LEFT VIDEO BOX */}
        <div className="
  w-[520px] h-[320px]
  rounded-2xl
  overflow-hidden
  border border-blue-400/20
  bg-gradient-to-br from-[#0a0f2c] to-[#050816]
  backdrop-blur-xl
  shadow-[0_0_40px_rgba(56,189,248,0.2)]
  relative
  animate-fadeIn
">

  {/* Subtle glow */}
  <div className="absolute inset-0 bg-blue-500/10 blur-2xl opacity-40" />

  <video
    src={heroVideo}
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover relative z-10"
  />
</div>

        {/* RIGHT INFO BOX */}
<div className="
  bg-gradient-to-br from-[#0a0f2c] to-[#050816]
  backdrop-blur-xl
  p-8
  rounded-2xl
  max-w-md
  border border-blue-400/20
  shadow-[0_0_40px_rgba(56,189,248,0.25)]
  animate-fadeIn
  relative
">

  {/* Glow layer */}
  <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-40" />

  <div className="relative z-10">
    <h1 className="text-4xl font-bold mb-4 text-blue-200">
      BuildWise AI
    </h1>

    <p className="text-gray-300 mb-6 leading-relaxed text-sm">
      Automatically extract quantities, estimate materials,
      generate cost insights, and create construction timelines
      from architectural and structural drawings — in minutes, not days.
    </p>

    <button
      onClick={() => setShowModal(true)}
      className="
        bg-indigo-600
        px-6 py-3
        rounded-lg
        font-semibold
        hover:scale-105
        hover:bg-indigo-500
        shadow-lg
        transition
      "
    >
      Get Started
    </button>
  </div>

</div>
      </div>


      {/* PROJECT SECTION */}
      {showModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="
          w-[420px]
          p-8
          rounded-2xl
          bg-gradient-to-br from-[#0a0f2c] to-[#050816]
          border border-blue-400/20
          shadow-[0_0_40px_rgba(56,189,248,0.25)]
          animate-fadeIn
          relative
        ">

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-6 text-blue-200">
            Create New Project
          </h2>

          {/* Project Name */}
          <input
            type="text"
            placeholder="Project Name"
            className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            id="projectName"
          />

          {/* Description */}
          <textarea
            placeholder="Project Description"
            className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            id="projectDesc"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Project Location"
            className="w-full mb-6 p-3 rounded-lg bg-black/40 border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            id="projectLocation"
          />

          {/* Buttons */}
          <div className="flex justify-between items-center">

            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
              const name = document.getElementById("projectName").value;
              const desc = document.getElementById("projectDesc").value;
              const location = document.getElementById("projectLocation").value;

              if (!name || !location) return alert("Name & Location required");

              try {
                const token = localStorage.getItem("token");

                const res = await axios.post(
                  "http://localhost:3000/api/projects",
                  {
                    projectName:name,
                    location: location,
                    projectType:desc
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );

                const projectId = res.data._id;

                navigate(`/upload/${projectId}`);
                setShowModal(false);

              } catch (err) {
                console.log(err);
                alert("Project creation failed ❌");
              }
            }}
              className="
                bg-indigo-600
                px-5 py-2
                rounded-lg
                font-semibold
                hover:scale-105
                hover:bg-indigo-500
                shadow-lg
                transition
              "
            >
              Create Project
            </button>

          </div>

        </div>
      </div>
    )}
    </div>
  );
}