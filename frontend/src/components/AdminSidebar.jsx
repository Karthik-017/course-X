import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const navItems = [
    {label: "Dashboard", path: "/" },
    { label: "Admin Signin", path: "/admin/auth" },
    { label: "Create Course", path: "/admin/courses" }, 
    { label: "My Courses", path: "/admin/my-courses" },
    { label: "Admin Dashboard", path: "/admin/dashboard" },
    { label: "Settings", path: "/admin/settings"}
];

return (
  <div className="w-64 bg-gray-100 h-screen p-4 shadow">
    <h2 className="text-xl font-bold mb-6">LMS Panel</h2>
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </div>
);
};

export default AdminSidebar;