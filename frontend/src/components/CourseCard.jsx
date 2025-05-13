import { useState } from "react";

const CourseCard = ({ course, onPurchase, onEdit, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="bg-white shadow-md hover:shadow-lg p-4 rounded-lg relative transition-all duration-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden rounded-md mb-3">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-indigo-600 font-bold text-lg">₹{course.price}</span>
        {course.creator && (
          <span className="text-xs text-gray-500">
            By {course.creator.firstName} {course.creator.lastName}
          </span>
        )}
      </div>

      {/* Purchase Button */}
      {onPurchase && (
        <button
          onClick={(e) => {
            // Prevent event propagation if this is wrapped in a Link
            if(e) {
              e.preventDefault();
              e.stopPropagation();
            }
            onPurchase(course.id, e);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full font-medium transition-colors duration-200"
        >
          Purchase
        </button>
      )}

      {/* Admin Buttons */}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-2">
          {onEdit && (
            <button
              onClick={(e) => {
                if(e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                onEdit(course);
              }}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-200 flex-1"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                if(e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                onDelete(course.id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200 flex-1"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;