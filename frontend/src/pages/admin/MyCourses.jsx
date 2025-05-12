import { useEffect, useState } from "react";
import API from "../../api";
import CourseCard from "../../components/CourseCard";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  const handleEditCourse = (course) => {
    // Navigate to the CreateEditCourse page with the course ID
    navigate(`/admin/courses/edit/${course.id}`, { state: { course } });
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
            onEdit={handleEditCourse}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCourses;