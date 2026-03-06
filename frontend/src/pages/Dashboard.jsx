import ProfileMenu from "../components/ProfileMenu";
import { useState,useEffect , useRef } from "react";
import logo from "../assets/logo.jpeg";
import heroVideo from "../assets/video.mp4";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const menuRef = useRef();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);
  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");

          const res = await axios.get(
            "http://localhost:3000/api/auth/profile",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setProfile(res.data.user);
          setStats(res.data.stats);

        } catch (err) {
          console.log("Profile load failed");
        }
      };

      fetchProfile();
    }, []);
  return (
    <div className="dashboard-container text-white">

      <div className="dashboard-overlay flex flex-col min-h-screen">

        {/* ================= TOP BAR ================= */}
        <div className="flex justify-between items-center px-14 pt-8 animate-fadeIn">

          <img
            src={logo}
            alt="logo"
            className="w-24 object-contain hover:scale-105 transition duration-500"
          />

          <div className="
            w-11 h-11 flex items-center justify-center
            rounded-full border border-white/20
            bg-black/40 backdrop-blur-md
            cursor-pointer hover:scale-110
            hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]
            transition
          ">
            <div className="relative profile-icon-wrapper" ref={menuRef}>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="
                w-10 h-10 flex items-center justify-center
                rounded-full border border-white/20
                bg-black/40 backdrop-blur-md
                cursor-pointer hover:scale-110
                transition
              "
            >
              <User size={22}/>
            </div>

            <ProfileMenu open={menuOpen} setOpen={setMenuOpen} profile={profile} stats={stats}/>

          </div>
          </div>

        </div>


        {/* ================= HERO SECTION ================= */}
        <div className="flex flex-1 items-center justify-center px-14">

          <div className="flex flex-wrap items-center justify-center gap-20">

            {/* ===== VIDEO BOX ===== */}
            <div className="
              w-[580px] h-[360px]
              rounded-2xl overflow-hidden
              border border-blue-400/20
              bg-gradient-to-br from-[#0a0f2c] to-[#050816]
              backdrop-blur-xl
              shadow-[0_0_60px_rgba(56,189,248,0.25)]
              relative animate-float
            ">

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


            {/* ===== INFO BOX ===== */}
            <div className="
              bg-gradient-to-br from-[#0a0f2c] to-[#050816]
              backdrop-blur-xl
              p-10 rounded-2xl
              max-w-lg
              border border-blue-400/20
              shadow-[0_0_60px_rgba(99,102,241,0.25)]
              animate-slideUp relative
            ">

              <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-40" />

              <div className="relative z-10">

                <h1 className="text-5xl font-bold mb-4 text-blue-200 animate-textReveal">
                  BuildWise AI
                </h1>

                <p className="text-gray-300 mb-8 leading-relaxed">
                  Automatically extract quantities, estimate materials,
                  generate cost insights, and create construction timelines
                  from architectural and structural drawings — in minutes.
                </p>

                <button
                  onClick={() => setShowModal(true)}
                  className="
                    bg-indigo-600 px-7 py-3
                    rounded-lg font-semibold
                    hover:scale-105 hover:bg-indigo-500
                    hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]
                    transition
                  "
                >
                  Get Started
                </button>

              </div>
            </div>

          </div>
        </div>


        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="
              w-[420px] p-8 rounded-2xl
              bg-gradient-to-br from-[#0a0f2c] to-[#050816]
              border border-blue-400/20
              shadow-[0_0_40px_rgba(56,189,248,0.25)]
              animate-slideUp relative
            ">

              <h2 className="text-2xl font-semibold mb-6 text-blue-200">
                Create New Project
              </h2>

              <input
                type="text"
                placeholder="Project Name"
                className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                id="projectName"
              />

              <textarea
                placeholder="Project Description"
                className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                id="projectDesc"
              />

              <input
                type="text"
                placeholder="Project Location"
                className="w-full mb-6 p-3 rounded-lg bg-black/40 border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                id="projectLocation"
              />

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

                    if (!name || !location)
                      return alert("Name & Location required");

                    try {

                      const token = localStorage.getItem("token");

                      const res = await axios.post(
                        "http://localhost:3000/api/projects",
                        {
                          projectName: name,
                          location: location,
                          projectType: desc
                        },
                        {
                          headers: { Authorization: `Bearer ${token}` }
                        }
                      );

                      navigate(`/upload/${res.data._id}`);
                      setShowModal(false);

                    } catch (err) {
                      alert("Project creation failed ❌");
                    }
                  }}
                  className="
                    bg-indigo-600 px-5 py-2
                    rounded-lg font-semibold
                    hover:scale-105 hover:bg-indigo-500
                    shadow-lg transition
                  "
                >
                  Create Project
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}