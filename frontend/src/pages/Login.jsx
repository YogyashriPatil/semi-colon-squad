import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      alert("Login Successful 🚀");

      // Redirect to Dashboard
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={submitHandler}>
        <input name="email" placeholder="Email" onChange={changeHandler} />
        <input name="password" type="password" placeholder="Password" onChange={changeHandler} />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;