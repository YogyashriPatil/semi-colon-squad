import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async () => {

    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password)
      return alert("Email & Password required");

    try {

      const url = isLogin
        ? "http://localhost:3000/api/auth/login"
        : "http://localhost:3000/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await axios.post(url, payload);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Auth Failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">

      {/* OUTER FRAME */}
      <div className="w-full max-w-md p-8 rounded-[30px] border border-indigo-400/30 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(99,102,241,0.25)]">

        {/* HEADING */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-300 tracking-wide">
            BuildWise AI
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Smart Construction Intelligence
          </p>
        </div>

        {/* INNER CARD */}
        <div className="p-6 rounded-[20px] border border-indigo-400/20 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.2)] transition">

          {/* TAB SWITCH */}
          <div className="flex mb-6 rounded-lg overflow-hidden">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm transition ${
                isLogin
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow"
                  : "bg-transparent text-gray-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm transition ${
                !isLogin
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow"
                  : "bg-transparent text-gray-400"
              }`}
            >
              Register
            </button>

          </div>

          {/* FORM */}
          <div className="space-y-4">

            {!isLogin && (
              <input
                id="name"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}

            <input
              id="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 hover:scale-105 transition shadow-lg"
            >
              {isLogin ? "Login" : "Register"}
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}