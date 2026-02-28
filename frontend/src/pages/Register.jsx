import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/auth/register", formData);
      alert("Registered Successfully ✅");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={submitHandler}>
        <input name="name" placeholder="Name" onChange={changeHandler} />
        <input name="email" placeholder="Email" onChange={changeHandler} />
        <input name="password" type="password" placeholder="Password" onChange={changeHandler} />
        <input name="role" placeholder="Role (engineer / client)" onChange={changeHandler} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;