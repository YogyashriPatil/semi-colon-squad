import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Star , TrendingUp} from "lucide-react";
import {
  UploadCloud,
  BarChart3,
  Calculator,
  CalendarClock,
  GitBranch,
  FileDown,
  FileText,
  Layers
} from "lucide-react";

const UploadDrawing = () => {
  const { projectId } = useParams();

  const [file, setFile] = useState(null);
  const [view, setView] = useState("analysis");
  const [loading, setLoading] = useState(false);

  const [drawingId, setDrawingId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [estimation, setEstimation] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [pipeline, setPipeline] = useState(null);

  // 🚀 Upload Handler
  const uploadHandler = async () => {
    if (!file) return alert("Select file first!");

    const formData = new FormData();
    formData.append("drawing", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:3000/api/drawings/upload/${projectId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ai = response.data.analysisResult;
      setAnalysis(ai.analysis);

      // AI timeline (initial)
      if(ai.timeline){
        setTimeline({
          phases: ai.timeline.phases || [],
          totalDuration: ai.timeline.totalDuration || 0
        });
      }

      // AI pipeline
      if(ai.pipeline){
        setPipeline(ai.pipeline);
      }
      const id = response.data._id;
      setDrawingId(id);

      const est = await axios.post(
        `http://localhost:3000/api/estimation/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEstimation(est.data.estimate);

      const tl = await axios.post(
        `http://localhost:3000/api/timeline/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTimeline({
        phases: tl.data?.phases || [],
        totalDuration: tl.data?.totalDuration || 0
      });

      const pipe = await axios.post(
        `http://localhost:3000/api/pipeline/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPipeline(pipe.data?.stages || []);

      alert("Upload & Analysis Completed 🚀");

    } catch (error) {
      console.log(error);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 📄 Section Download
  const downloadSectionReport = async (type) => {
    if (!drawingId) return alert("Upload first!");

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://localhost:3000/api/reports/${drawingId}`,
      { type },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.pdf) {
      window.open(`http://localhost:8000/${res.data.pdf}`);
    }
    if (res.data.excel) {
      window.open(`http://localhost:8000/${res.data.excel}`);
    }
  };

  return (
    <div className="upload-wrapper">

      <div className="upload-panel">

        {/* HEADER */}
        <h2 className="upload-title">
          <UploadCloud /> Upload Drawing
        </h2>

        {/* FILE UPLOAD */}
        {/* FILE UPLOAD */}
        <div className="upload-row">

          {/* CHOOSE FILE */}
          <label className="file-upload">
            <UploadCloud size={18} />
            <span>Choose Drawing</span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>

          {/* UPLOAD BUTTON */}
          <button className="upload-btn" onClick={uploadHandler}>
            Upload & Analyze
          </button>

        </div>

        {/* MODULE SWITCH */}
        <div className="module-switch">
          {[
            { key: "analysis", icon: <BarChart3 /> },
            { key: "estimation", icon: <Calculator /> },
            { key: "timeline", icon: <CalendarClock /> },
            { key: "pipeline", icon: <GitBranch /> },
          ].map(m => (
            <label key={m.key} className={view === m.key ? "active" : ""}>
              <input
                type="radio"
                checked={view === m.key}
                onChange={() => setView(m.key)}
              />
              {m.icon}
              {m.key}
            </label>
          ))}
        </div>

        {loading && <p className="loading">AI analyzing drawing...</p>}

        {/* RESULTS */}

        {view === "analysis" && analysis && (
        <div className="grid grid-cols-2 gap-6 mt-6 animate-fadeIn">

          <InfoCard icon="🧱" label="Walls" value={analysis.walls}/>
          <InfoCard icon="🏗️" label="Columns" value={analysis.columns}/>
          <InfoCard icon="🚪" label="Doors" value={analysis.doors}/>
          <InfoCard icon="🪟" label="Windows" value={analysis.windows}/>
          <InfoCard icon="📐" label="Floor Area" value={analysis.floorArea}/>
          <InfoCard icon="🛏️" label="Rooms" value={analysis.rooms}/>
          <InfoCard icon="🛁" label="Bathrooms" value={analysis.bathrooms}/>
          <InfoCard icon="📏" label="Wall Length" value={analysis.wallLength}/>
          <InfoCard icon="🏠" label="Layout" value={analysis.layoutType}/>
          <InfoCard icon="⚙️" label="Complexity" value={analysis.structureComplexity}/>
          <InfoCard icon="🧱" label="Slab Area" value={analysis.slabArea}/>
        </div>
        )}

        {view === "estimation" && estimation && (
          <div className="animate-fadeIn">

            <h2 className="text-xl mb-6 flex items-center gap-2 text-blue-200">
              <Calculator /> Estimation Comparison
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {/* BUDGET */}
              <div className="est-card border-green-400/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <h3 className="est-title text-green-300">
                  <TrendingUp size={18}/> Budget
                </h3>
                {Object.entries(estimation.budget || {}).map(([cat,val])=>(
                  <p key={cat} className="est-row">
                    {cat} : ₹{val.low.toFixed(0)} - ₹{val.high.toFixed(0)}
                  </p>
                ))}
              </div>

              {/* STANDARD */}
              <div className="est-card border-blue-400/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <h3 className="est-title text-blue-300">
                  <Layers size={18}/> Standard
                </h3>
                {Object.entries(estimation.standard || {}).map(([cat,val])=>(
                  <p key={cat} className="est-row">
                    {cat} : ₹{val.low.toFixed(0)} - ₹{val.high.toFixed(0)}
                  </p>
                ))}
              </div>

              {/* PREMIUM */}
              <div className="est-card border-purple-400/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <h3 className="est-title text-purple-300">
                  <Star size={18}/> Premium
                </h3>
                {Object.entries(estimation.premium || {}).map(([cat,val])=>(
                  <p key={cat} className="est-row">
                    {cat} : ₹{val.low.toFixed(0)} - ₹{val.high.toFixed(0)}
                  </p>
                ))}
              </div>

            </div>

            {/* FULL DOWNLOAD */}
            <div className="flex justify-center gap-4 mt-8">

              <button
                onClick={()=>downloadSectionReport("estimation")}
                className="download-btn"
              >
                <FileDown size={16}/> PDF
              </button>

              <button
                onClick={()=>downloadSectionReport("estimation")}
                className="download-btn"
              >
                <FileText size={16}/> Excel
              </button>

            </div>

          </div>
        )}
        {view === "timeline" && timeline?.phases?.length > 0 && (
          <div className="timeline-roadmap animate-fadeIn">

            <h2 className="timeline-title">
              <CalendarClock /> Construction Roadmap
            </h2>

            <div className="timeline-container">

              {timeline.phases.map((phase, index) => {

                const icons = {
                  "Site Preparation": "🌍",
                  "Foundation Work": "🏗️",
                  "Plinth Beam": "🧱",
                  "Column & Structure": "🏢",
                  "Wall Construction": "🧱",
                  "Roof Slab": "🏠",
                  "Plumbing Rough": "🚰",
                  "Electrical Rough": "⚡",
                  "Flooring": "🪵",
                  "Doors & Windows": "🚪",
                  "Interior Finishing": "🛋️",
                  "Painting": "🎨"
                };

                return (
                  <div key={index} className="timeline-step">

                    {/* Connector Line */}
                    {index !== 0 && <div className="timeline-line" />}

                    {/* Circle */}
                    <div className="timeline-circle">
                      {icons[phase.phase] || "🏗️"}
                    </div>

                    {/* Content */}
                    <div className="timeline-content">
                      <p className="timeline-phase">{phase.phase}</p>
                      <p className="timeline-duration">
                        {phase.durationDays} Days
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Total Duration */}
            <div className="timeline-total">
              Total Duration : {timeline.totalDuration} Days
            </div>

            {/* Download */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => downloadSectionReport("timeline")}
                className="download-btn"
              >
                <FileDown size={16}/> PDF
              </button>
              <button
                onClick={() => downloadSectionReport("timeline")}
                className="download-btn"
              >
                <FileText size={16}/> Excel
              </button>
            </div>

          </div>
        )}
        {view === "pipeline" && pipeline && (
          <div className="report-card">
            <h3><GitBranch /> Pipeline</h3>

            {pipeline.map(stage => (
              <div key={stage.order}>
                {stage.order}. {stage.stage}
              </div>
            ))}

            <div className="download-actions">
              <button onClick={() => downloadSectionReport("pipeline")}>
                <FileDown size={16}/> PDF
              </button>
              <button onClick={() => downloadSectionReport("pipeline")}>
                <FileText size={16}/> Excel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
const InfoCard = ({icon,label,value}) => (
  <div className="ai-card">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);
export default UploadDrawing;