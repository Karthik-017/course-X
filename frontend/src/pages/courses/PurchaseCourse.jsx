import { useEffect, useState } from "react";


import { useNavigate } from "react-router-dom";
import API from "../../api";
import CourseCard from "../../components/CourseCard";


const PurchaseCourse = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("http://localhost:8000/course/preview");
        setCourses(res.data.courses);
      } catch (err) {
        setMessage("Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  const handlePurchase = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "http://localhost:8000/course/purchase",
        { courseId },
        {headers: {
          Authorization: `Bearer ${token}`, // ✅ This is required
        },
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/user/purchases"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Buy a Course</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
  <CourseCard
    key={course.id}
    course={course}
    onPurchase={handlePurchase}
  />
))}
      </div>
    </div>
  );
};

export default PurchaseCourse;
