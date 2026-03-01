import { useNavigate } from "react-router-dom";
import { History, User, LogOut } from "lucide-react";

export default function ProfileMenu({ open, setOpen }) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-3 w-48 z-50 animate-dropdown">

      <div className="bg-white/10 backdrop-blur-xl border border-indigo-400/20 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] overflow-hidden">

        <button
          onClick={() => navigate("/history")}
          className="menu-item"
        >
          <History size={16}/> History
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="menu-item"
        >
          <User size={16}/> Profile
        </button>

        <button
          onClick={logout}
          className="menu-item text-red-400"
        >
          <LogOut size={16}/> Logout
        </button>

      </div>

    </div>
  );
}