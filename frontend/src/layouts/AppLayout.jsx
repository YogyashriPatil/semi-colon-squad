import CivilBackground from "../components/CivilBackground";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="relative isolate min-h-screen text-white">

      {/* GLOBAL CIVIL BACKGROUND */}
      <CivilBackground />

      {/* ALL PAGES RENDER HERE */}
      <div className="relative z-10">
        <Outlet />
      </div>

    </div>
  );
}