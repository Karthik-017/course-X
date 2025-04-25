import { useState } from "react";
import API from "../../api";

const CreateEditCourse = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? parseFloat(value) || 0 : value, // Convert price to float
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("http://localhost:8000/admin/course", form, {
        headers: { Authorization: token },
      });
      setMessage(`Course Created: ID ${res.data.courseId}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating course");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Course Title" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Course Description" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="imageUrl" placeholder="Image URL" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create Course</button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default CreateEditCourse;
