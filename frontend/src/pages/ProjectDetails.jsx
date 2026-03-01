import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectDetails() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("analysis");

  useEffect(() => {

    const fetchDetails = async () => {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3000/api/project-details/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setData(res.data);
    };

    fetchDetails();

  }, [id]);

  if (!data) return <p className="p-10 text-white">Loading...</p>;

  return (
    <div className="p-10 text-white space-y-6">

      {/* PROJECT HEADER */}
      <div>
        <h2 className="text-2xl font-bold">{data.project.projectName}</h2>
        <p>{data.project.location}</p>
        <p>{data.project.projectType}</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mt-6">
        {["analysis","estimation","timeline","pipeline"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg border
              ${tab === t
                ? "bg-indigo-500 text-white"
                : "bg-transparent border-indigo-400 text-gray-300"}
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-6">

        {tab === "analysis" && (
          <pre>{JSON.stringify(data.drawing?.analysisResult, null, 2)}</pre>
        )}

        {tab === "estimation" && (
          <pre>{JSON.stringify(data.estimation?.estimate, null, 2)}</pre>
        )}

        {tab === "timeline" && (
          <pre>{JSON.stringify(data.timeline?.phases, null, 2)}</pre>
        )}

        {tab === "pipeline" && (
          <pre>{JSON.stringify(data.pipeline?.stages, null, 2)}</pre>
        )}

      </div>

    </div>
  );
}