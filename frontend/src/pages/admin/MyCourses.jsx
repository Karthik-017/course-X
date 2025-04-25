// import { useEffect, useState } from "react";
// import API from "../../api";
// import CourseCard from "../../components/CourseCard"; // adjust the path if needed

// const MyCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await API.get("http://localhost:8000/admin/course/bulk", {
//           headers: { Authorization: token }
//         });
//         setCourses(res.data.courses);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load courses");
//       }
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">My Courses</h2>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyCourses;


import { useEffect, useState } from "react";
import API from "../../api";
import CourseCard from "../../components/CourseCard"; // adjust the path if needed

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
  });
  const [message, setMessage] = useState("");

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("http://localhost:8000/admin/course/bulk", {
        headers: { Authorization: token },
      });
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      price: course.price,
    });
    setMessage("");
    setError("");
  };

  const closeModal = () => {
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const body = {
        courseId: editingCourse.id,
        ...form,
      };
      const res = await API.put("http://localhost:8000/admin/course", body, {
        headers: { Authorization: token },
      });

      setMessage(res.data.message || "Course updated successfully");
      closeModal();
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "Error updating course");
    }
  };

  const handleDelete = async (courseId) => {
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete("http://localhost:8000/admin/course", {
        headers: { Authorization: token },
        data: { courseId }, // DELETE with body
      });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting course");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Course Title"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Course Description"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-2 border rounded"
                required
              />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                Update Course
              </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
