import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../../components/SortableItem";
import API from "../../api";

const CreateEditCourse = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!courseId;
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
  });
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch course data if in edit mode
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!isEditMode) return;
      
      setLoading(true);
      try {
        // Try to use the course from location state first if available
        if (location.state?.course) {
          const course = location.state.course;
          setForm({
            title: course.title || "",
            description: course.description || "",
            imageUrl: course.imageUrl || "",
            price: course.price || 0,
          });
          
          // If we need to fetch full course details including sections
          const token = localStorage.getItem("token");
          const res = await API.get(`http://localhost:8000/admin/course/${courseId}`, {
            headers: { Authorization: token },
          });
          
          // Format sections and contents from API response
          if (res.data.course?.sections) {
            const formattedSections = res.data.course.sections.map(section => ({
              id: section.id,
              title: section.title,
              contents: section.contents.map(content => ({
                id: content.id,
                title: content.title,
                type: content.type,
                url: content.url || "",
                text: content.text || "",
                duration: content.duration || 0,
              }))
            }));
            setSections(formattedSections);
          }
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Error fetching course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, isEditMode, location.state]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: "",
      contents: [],
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (sectionId) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const updateSectionTitle = (id, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, title: value } : section
      )
    );
  };

  const addContent = (sectionId) => {
    const newContent = {
      id: Date.now().toString(),
      title: "",
      type: "video",
      url: "",
      text: "",
      duration: 0,
    };
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, contents: [...section.contents, newContent] }
          : section
      )
    );
  };

  const deleteContent = (sectionId, contentId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              contents: section.contents.filter((c) => c.id !== contentId),
            }
          : section
      )
    );
  };

  const updateContentField = (sectionId, contentId, field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              contents: section.contents.map((content) =>
                content.id === contentId ? { ...content, [field]: value } : content
              ),
            }
          : section
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const newSections = arrayMove(sections, oldIndex, newIndex);
    setSections(newSections);
  };

  const handleContentDragEnd = (event, sectionId) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const oldIndex = section.contents.findIndex((c) => c.id === active.id);
          const newIndex = section.contents.findIndex((c) => c.id === over.id);
          const newContents = arrayMove(section.contents, oldIndex, newIndex);
          return { ...section, contents: newContents };
        }
        return section;
      })
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");

  //     const formattedSections = sections.map((section, sIdx) => ({
  //       title: section.title,
  //       order: sIdx + 1,
  //       contents: section.contents.map((content, cIdx) => ({
  //         ...content,
  //         order: cIdx + 1,
  //       })),
  //     }));

  //     const payload = { ...form, sections: formattedSections };
      
  //     let res;
  //     if (isEditMode) {
  //       // Update existing course
  //       payload.courseId = courseId;
  //       res = await API.put("http://localhost:8000/admin/course", payload, {
  //         headers: { Authorization: token },
  //       });
  //       setMessage("Course Updated Successfully");
  //     } else {
  //       // Create new course
  //       res = await API.post("http://localhost:8000/admin/course", payload, {
  //         headers: { Authorization: token },
  //       });
  //       setMessage(`Course Created: ID ${res.data.course?.id}`);
  //     }
      
  //     // Navigate back to courses list after a short delay
  //     setTimeout(() => {
  //       navigate("/admin/courses");
  //     }, 2000);
      
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} course`);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      const formattedSections = sections.map((section, sIdx) => ({
        title: section.title,
        order: sIdx + 1,
        contents: section.contents.map((content, cIdx) => ({
          ...content,
          order: cIdx + 1,
        })),
      }));
  
      const payload = { 
        ...form, 
        sections: formattedSections,
        courseId: courseId // This will be a string from useParams
      };
      
      let res;
      if (isEditMode) {
        res = await API.put("http://localhost:8000/admin/course", payload, {
          headers: { Authorization: token },
        });
        setMessage("Course Updated Successfully");
      } else {
        res = await API.post("http://localhost:8000/admin/course", payload, {
          headers: { Authorization: token },
        });
        setMessage(`Course Created: ID ${res.data.course?.id}`);
      }
      
      setTimeout(() => {
        navigate("/admin/my-courses");
      }, 2000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} course`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading course details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? "Edit" : "Create"} Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          placeholder="Course Title"
          onChange={handleFormChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="Course Description"
          onChange={handleFormChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="imageUrl"
          value={form.imageUrl}
          placeholder="Image URL"
          onChange={handleFormChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          placeholder="Price"
          onChange={handleFormChange}
          className="w-full p-2 border rounded"
          required
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
          <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section, sectionIndex) => (
              <SortableItem key={section.id} id={section.id}>
                <div className="border p-4 my-4 rounded bg-gray-50">
                  <div className="text-md font-semibold text-gray-700 mb-1">Section {sectionIndex + 1}</div>
                  <input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    placeholder="Section Title"
                    className="w-full p-2 border rounded mb-2"
                  />

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleContentDragEnd(event, section.id)}
                  >
                    <SortableContext
                      items={section.contents.map((content) => content.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {section.contents.map((content, index) => (
                        <SortableItem key={content.id} id={content.id}>
                          <div className="w-full relative">
                            <div className="text-sm text-gray-500 mb-1">Content {index + 1}</div>
                            <input
                              value={content.title}
                              onChange={(e) =>
                                updateContentField(section.id, content.id, "title", e.target.value)
                              }
                              placeholder="Content Title"
                              className="w-full p-2 border rounded mb-2"
                            />
                            <select
                              value={content.type}
                              onChange={(e) =>
                                updateContentField(section.id, content.id, "type", e.target.value)
                              }
                              className="w-full p-2 border rounded mb-2"
                            >
                              <option value="video">Video</option>
                              <option value="text">Text</option>
                            </select>
                            {content.type === "video" ? (
                              <>
                                <input
                                  value={content.url}
                                  onChange={(e) =>
                                    updateContentField(section.id, content.id, "url", e.target.value)
                                  }
                                  placeholder="Video URL"
                                  className="w-full p-2 border rounded mb-2"
                                />
                                <input
                                  value={content.duration === 0 ? "" : content.duration}
                                  type="text"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                      updateContentField(
                                        section.id,
                                        content.id,
                                        "duration",
                                        parseInt(value || "0", 10)
                                      );
                                    }
                                  }}
                                  placeholder="Duration (min)"
                                  className="w-full p-2 border rounded"
                                />
                              </>
                            ) : (
                              <textarea
                                value={content.text}
                                onChange={(e) =>
                                  updateContentField(section.id, content.id, "text", e.target.value)
                                }
                                placeholder="Content Text"
                                className="w-full p-2 border rounded"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => deleteContent(section.id, content.id)}
                              className="absolute top-0 right-0 text-red-600 px-2"
                            >
                              ✕
                            </button>
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                  <button
                    type="button"
                    onClick={() => addContent(section.id)}
                    className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
                  >
                    Add Content
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(section.id)}
                    className="ml-2 mt-2 px-4 py-1 bg-red-600 text-white rounded"
                  >
                    Delete Section
                  </button>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

        <button type="button" onClick={addSection} className="w-full bg-yellow-500 text-white py-2 rounded">
          Add Section
        </button>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {isEditMode ? "Update" : "Create"} Course
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default CreateEditCourse;