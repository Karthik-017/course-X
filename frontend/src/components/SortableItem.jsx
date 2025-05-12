// import React from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// const SortableItem = ({ id, children }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="cursor-move"
//     >
//       {children}
//     </div>
//   );
// };

// export default SortableItem;

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableItem({ id, children}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative mb-2">
    
      <div className="flex items-center border rounded bg-white p-3 pl-8">
        <div className="flex-grow">{children}</div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab pl-2 flex items-center text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={20} />
        </div>
      </div>
    </div>
  );
}

export default SortableItem;