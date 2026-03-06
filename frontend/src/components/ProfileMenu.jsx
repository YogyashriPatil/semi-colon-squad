import { useNavigate } from "react-router-dom";
import { History, User, Mail, ShieldCheck, Folder, LogOut } from "lucide-react";

export default function ProfileMenu({ open, setOpen, profile, stats }) {

  const navigate = useNavigate();

  const goProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const goHistory = () => {
    setOpen(false);
    navigate("/history");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!open) return null;

  return (
<div className="menu-container">

      <div className="menu-card">

        <div className="menu-item" onClick={goProfile}>
          <User size={18}/>
          <span>Profile</span>
        </div>

        <div className="menu-item" onClick={goHistory}>
          <History size={18}/>
          <span>History</span>
        </div>

        <div className="menu-item logout" onClick={logout}>
          <LogOut size={18}/>
          <span>Logout</span>
        </div>

      </div>

    </div>
      );
}

const ProfileRow = ({ icon, label, value }) => (
  <div className="profile-row">
    <div className="row-left">
      {icon}
      <span>{label}</span>
    </div>
    <p>{value}</p>
  </div>
);