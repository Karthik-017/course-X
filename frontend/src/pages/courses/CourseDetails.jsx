import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import { jwtDecode } from "jwt-decode";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [expandedSectionIndex, setExpandedSectionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // console.log(id);
  
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await API.get(`http://localhost:8000/course/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        
        console.log("Course data received:", res.data);
        setCourse(res.data.course);
        setIsPurchased(res.data.isPurchased);
      } catch (err) {
        console.error("Failed to fetch course details", err);
        setMessage("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, token]);

  const toggleSection = (index) => {
    setExpandedSectionIndex(index === expandedSectionIndex ? null : index);
  };

  const getEmbedUrl = (url) => {
    if (url?.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // fallback for other types
  };

  const handlePurchase = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      console.log("Attempting to purchase course:", id);
      const res = await API.post(
        "http://localhost:8000/course/purchase",
        { courseId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Purchase response:", res.data);
      setMessage(res.data.message || "Purchase successful!");
      setIsPurchased(true);
      
      setTimeout(() => {
        navigate("/user/purchases");
      }, 2000);
      
    } catch (err) {
      console.error("Purchase failed:", err);
      setMessage(err.response?.data?.message || "Purchase failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-indigo-600 text-xl">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          Course not found or error loading course details
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md">
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}
      
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">
        {course.title}
      </h2>
      
      <div className="mb-6">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full rounded-lg border-2 border-indigo-200 shadow-md"
        />
      </div>
      
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <p className="text-gray-800 mb-4">{course.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-green-600 font-semibold text-xl">
            Price: ₹{course.price}
          </p>
          
          <p className="text-gray-600">
            Instructor:{" "}
            <span className="font-medium text-blue-700">
              {course.creator?.firstName} {course.creator?.lastName}
            </span>
          </p>
        </div>
        
        {!isPurchased && (
          <button
            onClick={handlePurchase}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 w-full"
          >
            Purchase This Course
          </button>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
          Course Content
        </h3>
        
        {course.sections && course.sections.map((section, index) => (
          <div
            key={index}
            className="mb-3 border border-indigo-300 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left px-4 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-semibold flex justify-between items-center"
              onClick={() => toggleSection(index)}
            >
              {section.title}
              <span className="text-indigo-600">
                {expandedSectionIndex === index ? "▲" : "▼"}
              </span>
            </button>
            
            {expandedSectionIndex === index && (
              <div className="bg-white">
                {isPurchased ? (
                  /* PURCHASED: Show content */
                  <ul className="px-6 py-3">
                    {section.contents && section.contents.length > 0 ? (
                      section.contents.map((content, i) => (
                        <li
                          key={i}
                          className="py-2 border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <div className="text-indigo-700 font-semibold mb-2">
                            {content.title}
                          </div>
                          
                          {content.type === "video" && content.url ? (
                            <iframe
                              src={getEmbedUrl(content.url)}
                              title={content.title}
                              className="w-full h-64 rounded border"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : content.type === "text" && content.text ? (
                            <p className="p-3 bg-gray-50 rounded text-gray-700">
                              {content.text}
                            </p>
                          ) : (
                            <p className="text-gray-500 italic">No content available</p>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="py-3 text-gray-500 italic text-center">
                        No content available for this section
                      </li>
                    )}
                  </ul>
                ) : (
                  /* NOT PURCHASED: Show purchase prompt */
                  <div className="p-6 text-center">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-indigo-700 mb-3">
                        Purchase this course to access the content
                      </p>
                      <button
                        onClick={handlePurchase}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
                      >
                        Purchase Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {(!course.sections || course.sections.length === 0) && (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 text-center">
            No sections available for this course
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;