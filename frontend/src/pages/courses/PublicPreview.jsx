import { useEffect, useState } from "react";
import API from "../../api";
import CourseCard from "../../components/CourseCard"; // Adjust the path based on your folder structure

const PublicPreview = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("http://localhost:8000/course/preview");
        setCourses(res.data.courses);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load courses");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default PublicPreview;
