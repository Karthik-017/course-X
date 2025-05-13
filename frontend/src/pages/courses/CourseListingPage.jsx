import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import CourseCard from "../../components/CourseCard";

const CourseListingPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await API.get("http://localhost:8000/course/preview");
        setCourses(res.data.courses);
      } catch (err) {
        setMessage("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handlePurchase = async (courseId, e) => {
    // Prevent navigation when clicking the purchase button
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      console.log("Purchasing course:", courseId);
      const res = await API.post(
        "http://localhost:8000/course/purchase",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Purchase response:", res.data);
      setMessage(res.data.message || "Purchase successful!");
      setTimeout(() => navigate("/user/purchases"), 1500);
    } catch (err) {
      console.error("Purchase error:", err);
      setMessage(err.response?.data?.message || "Purchase failed. Please try again.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading courses...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">Available Courses</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="transition-transform hover:scale-102">
            <Link to={`/course/${course.id}`}>
              <CourseCard 
                course={course} 
                onPurchase={handlePurchase}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListingPage;