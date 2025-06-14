import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Admin Signin", path: "/admin/auth" },
    { label: "Create Course", path: "/admin/courses" },
    { label: "My Courses", path: "/admin/my-courses" },
    { label: "Admin Dashboard", path: "/admin/dashboard" },
    { label: "Settings", path: "/admin/settings" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/admin/auth"; // Redirect to login page
  };

  return (
    <div className="w-64 bg-gray-100 h-screen p-4 shadow flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">LMS Panel</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded ${
                  isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
