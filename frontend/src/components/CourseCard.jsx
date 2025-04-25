// // src/components/CourseCard.jsx

// const CourseCard = ({ course, onPurchase }) => {
//   return (
//     <div className="bg-white shadow p-4 rounded">
//       <img
//         src={course.imageUrl}
//         alt={course.title}
//         className="w-full h-40 object-cover rounded mb-2"
//       />
//       <h3 className="text-xl font-semibold">{course.title}</h3>
//       <p className="text-sm text-gray-600 mb-2">{course.description}</p>
//       <span className="text-blue-600 font-bold block mb-2">₹{course.price}</span>

//       {onPurchase && (
//         <button
//           onClick={() => onPurchase(course.id)}
//           className="bg-green-600 text-white px-4 py-2 rounded w-full"
//         >
//           Purchase
//         </button>
//       )}
//     </div>
//   );
// };

// export default CourseCard;


const CourseCard = ({ course, onPurchase, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow p-4 rounded relative">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-xl font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{course.description}</p>
      <span className="text-blue-600 font-bold block mb-2">₹{course.price}</span>

      {/* Purchase Button */}
      {onPurchase && (
        <button
          onClick={() => onPurchase(course.id)}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Purchase
        </button>
      )}

      {/* Admin Buttons */}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-2">
          {onEdit && (
            <button
              onClick={() => onEdit(course)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(course.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
