import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function History() {

  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/history",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProjects(res.data);

      } catch {
        alert("Failed to load history");
      }
    };

    fetchHistory();

  }, []);

  return (
    <div className="p-10 text-white">

      <h1 className="text-3xl font-bold mb-8 text-indigo-300">
        Project History
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {projects.map(p => (
          <div
            key={p._id}
            onClick={() => navigate(`/project/${p._id}`)}
            className="
              cursor-pointer p-6 rounded-xl
              bg-white/5 backdrop-blur-xl
              border border-indigo-400/20
              hover:scale-[1.02]
              transition
              shadow-[0_0_25px_rgba(99,102,241,0.2)]
            "
          >

            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FolderOpen size={18}/> {p.projectName}
            </h3>

            <p className="text-gray-400 text-sm mb-2">
              {p.projectType}
            </p>

            <p className="text-gray-500 text-xs flex items-center gap-2">
              <Calendar size={14}/>
              {new Date(p.createdAt).toLocaleDateString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}