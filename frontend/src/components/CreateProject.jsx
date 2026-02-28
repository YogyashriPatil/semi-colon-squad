import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [projectType, setProjectType] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:3000/api/projects",
        {
          projectName,
          location,
          projectType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🚀 Redirect to Upload Page
      navigate(`/upload/${data._id}`);

    } catch (error) {
      alert("Error creating project");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        placeholder="Project Type"
        value={projectType}
        onChange={(e) => setProjectType(e.target.value)}
      />

      <button type="submit">Create Project</button>
    </form>
  );
};

export default CreateProject;