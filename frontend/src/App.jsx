import {  Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadDrawing from "./components/UploadDrawing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
function App() {
  return (
    <Routes>

      {/* BACKGROUND LAYOUT */}
      <Route element={<AppLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload/:projectId" element={<UploadDrawing />} />

      </Route>

    </Routes>
    );
}

export default App;