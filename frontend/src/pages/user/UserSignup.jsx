import { useState } from "react";
import API from "../../api";
import AuthForm from "../../components/AuthForm";

const UserSignup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
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
    { name: "phone", type: "text", placeholder: "Phone Number", value: form.phone },
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


// import { useState } from "react";
// import API from "../../api";
// import AuthForm from "../../components/AuthForm";

// const UserSignup = () => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phone: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // First name validation
//     if (form.firstName.trim().length < 3) {
//       setMessage("First name must be at least 3 characters long");
//       return;
//     }

//     // Gmail validation
//     const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//     if (!gmailRegex.test(form.email)) {
//       setMessage("Only Gmail addresses are allowed");
//       return;
//     }

//     // Password validation
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(form.password)) {
//       setMessage("Password must be at least 8 characters, include uppercase, lowercase, number, and special character");
//       return;
//     }

//     // Phone number validation
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(form.phone)) {
//       setMessage("Phone number must be 10 digits");
//       return;
//     }

//     try {
//       const res = await API.post("http://localhost:8000/user/signup", form);
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Signup failed");
//     }
//   };

//   const fields = [
//     { name: "firstName", type: "text", placeholder: "First Name", value: form.firstName },
//     { name: "lastName", type: "text", placeholder: "Last Name", value: form.lastName },
//     { name: "email", type: "email", placeholder: "Email", value: form.email },
//     { name: "password", type: "password", placeholder: "Password", value: form.password },
//     { name: "phone", type: "text", placeholder: "Phone Number", value: form.phone },
//   ];

//   return (
//     <AuthForm
//       title="User Signup"
//       fields={fields}
//       onChange={handleChange}
//       onSubmit={handleSubmit}
//       message={message}
//       buttonLabel="Signup"
//     />
//   );
// };

// export default UserSignup;
