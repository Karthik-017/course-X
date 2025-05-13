import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import AuthForm from "../../components/AuthForm";

const UserSignin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Signin request
      const res = await API.post("http://localhost:8000/user/signin", form);
      const token = res.data.token;
      localStorage.setItem("token", token);

    

      // localStorage.setItem("user", JSON.stringify(profileRes.data.user));
      setMessage("Signin successful");

      navigate("/user/purchases");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signin failed");
    }
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Email", value: form.email },
    { name: "password", type: "password", placeholder: "Password", value: form.password },
  ];

  return (
    <AuthForm
      title="User Signin"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      message={message}
      buttonLabel="Signin"
    />
  );
};

export default UserSignin;
