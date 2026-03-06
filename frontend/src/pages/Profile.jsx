import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, ShieldCheck, Folder } from "lucide-react";

const Profile = () => {

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      try {

        const res = await axios.get(
          "http://localhost:3000/api/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(res.data);

        const statsRes = await axios.get(
          "http://localhost:3000/api/profile/stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStats(statsRes.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();

  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">

      <h2 className="profile-title">👤 My Profile</h2>

      <div className="profile-card">

        <div className="profile-item">
          <User size={18}/> 
          <span>Name:</span> {profile.name}
        </div>

        <div className="profile-item">
          <Mail size={18}/> 
          <span>Email:</span> {profile.email}
        </div>

        <div className="profile-item">
          <ShieldCheck size={18}/> 
          <span>Role:</span> {profile.role}
        </div>

        <div className="profile-item">
          <Folder size={18}/> 
          <span>Total Projects:</span> {stats?.totalProjects || 0}
        </div>

        <div className="profile-item">
          <span>Joined:</span> 
          {new Date(profile.createdAt).toLocaleDateString()}
        </div>

      </div>

    </div>
  );
};

export default Profile;