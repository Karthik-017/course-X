// src/pages/user/UserAuthPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import AuthForm from "../../components/AuthForm";

const UserAuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn) {
      // Validation for Sign Up
      if (form.firstName.trim().length < 3) {
        setMessage("First name must be at least 3 characters long");
        return;
      }

      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(form.email)) {
        setMessage("Only Gmail addresses are allowed");
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(form.password)) {
        setMessage("Password must be strong");
        return;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(form.phone)) {
        setMessage("Phone number must be 10 digits");
        return;
      }
    }

    try {
      if (isSignIn) {
        const res = await API.post("http://localhost:8000/user/signin", {
          email: form.email,
          password: form.password,
        });

        const token = res.data.token;
        localStorage.setItem("token", token);

        const profileRes = await API.get("http://localhost:8000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("user", JSON.stringify(profileRes.data.user));
        setMessage("Signin successful");
        navigate("/user/purchases");
      } else {
        const res = await API.post("http://localhost:8000/user/signup", form);
        setMessage(res.data.message);
        setIsSignIn(true); // Switch to sign in after signup
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
        { name: "firstName", type: "text", placeholder: "First Name", value: form.firstName },
        { name: "lastName", type: "text", placeholder: "Last Name", value: form.lastName },
        { name: "email", type: "email", placeholder: "Email", value: form.email },
        { name: "password", type: "password", placeholder: "Password", value: form.password },
        { name: "phone", type: "text", placeholder: "Phone Number", value: form.phone },
      ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AuthForm
        title={isSignIn ? "User Sign In" : "User Sign Up"}
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

export default UserAuthPage;
