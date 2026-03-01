import {  Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadDrawing from "./components/UploadDrawing";
import AppLayout from "./layouts/AppLayout";
import AuthPage from "./pages/AuthPage";
import History from "./pages/History";
import ProjectDetails from "./pages/ProjectDetails";
function App() {
  return (
    <Routes>

      {/* BACKGROUND LAYOUT */}
      <Route element={<AppLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/upload/:projectId" element={<UploadDrawing />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Route>

    </Routes>
    );
}

export default App;