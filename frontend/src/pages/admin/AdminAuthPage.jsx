// src/pages/admin/AdminAuthPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import AuthForm from "../../components/AuthForm";

const AdminAuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignIn) {
        const res = await API.post("http://localhost:8000/admin/signin", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        setMessage("Signin successful");
        navigate("/admin/my-courses");
      } else {
        const res = await API.post("http://localhost:8000/admin/signup", form);
        setMessage(res.data.message);
        setIsSignIn(true); // After signup, switch to sign in
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed");
    }
  };

  const fields = isSignIn
    ? [
        { name: "email", type: "email", placeholder: "Email", value: form.email },
        { name: "password", type: "password", placeholder: "Password", value: form.password },
      ]
    : [
        { name: "firstName", placeholder: "First Name", value: form.firstName },
        { name: "lastName", placeholder: "Last Name", value: form.lastName },
        { name: "email", type: "email", placeholder: "Email", value: form.email },
        { name: "password", type: "password", placeholder: "Password", value: form.password },
      ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AuthForm
        title={isSignIn ? "Admin Sign In" : "Admin Sign Up"}
        fields={fields}
        onChange={handleChange}
        onSubmit={handleSubmit}
        message={message}
        buttonLabel={isSignIn ? "Sign In" : "Sign Up"}
      />
      <div className="mt-4 text-center">
        {isSignIn ? (
          <p>
            Not registered?{" "}
            <button onClick={() => setIsSignIn(false)} className="text-blue-500 underline">
              Register
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsSignIn(true)} className="text-blue-500 underline">
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAuthPage;
