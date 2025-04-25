import { useState } from "react";
import API from "../../api";
import AuthForm from "../../components/AuthForm";

const UserSignup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("http://localhost:8000/user/signup", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const fields = [
    { name: "firstName", type: "text", placeholder: "First Name", value: form.firstName },
    { name: "lastName", type: "text", placeholder: "Last Name", value: form.lastName },
    { name: "email", type: "email", placeholder: "Email", value: form.email },
    { name: "password", type: "password", placeholder: "Password", value: form.password },
  ];

  return (
    <AuthForm
      title="User Signup"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      message={message}
      buttonLabel="Signup"
    />
  );
};

export default UserSignup;
