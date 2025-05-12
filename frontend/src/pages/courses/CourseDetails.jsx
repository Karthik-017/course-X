import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";

import { jwtDecode } from "jwt-decode";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [expandedSectionIndex, setExpandedSectionIndex] = useState(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`http://localhost:8000/course/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(res.data.course);
        setIsPurchased(res.data.isPurchased);
      } catch (err) {
        console.error("Failed to fetch course details");
      }
    };
    fetchCourse();
  }, [id]);

  const toggleSection = (index) => {
    setExpandedSectionIndex(index === expandedSectionIndex ? null : index);
  };

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // fallback for other types
  };

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">
        {course.title}
      </h2>
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full max-w-md mb-6 rounded-lg border-2 border-indigo-200 shadow"
      />
      <p className="text-gray-800 mb-2">{course.description}</p>
      <p className="mb-1 text-green-600 font-semibold">
        Price: ₹{course.price}
      </p>
      <p className="mb-4 text-gray-600">
        Instructor:{" "}
        <span className="font-medium text-blue-700">
          {course.creator.firstName} {course.creator.lastName}
        </span>
      </p>

      <div>
        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
          Course Sections
        </h3>
        {course.sections.map((section, index) => (
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
              <ul className="px-6 py-3 bg-white text-gray-800">
                {section.contents.length > 0 ? (
                  section.contents.map((content, i) => (
                    <li
                      key={i}
                      className="py-2 border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <strong>{content.title}</strong>
                      {isPurchased && (
                        <div className="text-sm text-gray-600">
                          {content.type === "video" && content.url && (
                            <iframe
                              src={getEmbedUrl(content.url)}
                              title={content.title}
                              className="w-full h-64 mt-2 rounded border"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          )}
                          {content.type === "text" && content.text && (
                            <p>{content.text}</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">
                    Purchase this coures to view content
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetails;
