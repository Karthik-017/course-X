import { NavLink } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const Sidebar = () => {
  const { logo } = useSettings();
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "User Signup", path: "/user/signup" },
    { label: "User Signin", path: "/user/signin" },
    
    
    { label: "Public Courses", path: "/courses/preview" },
    { label: "Purchase Course", path: "/courses/purchase" },
    { label: "Admin", path: "/admin/signin" },
   
   
    
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen p-4 shadow">
      <div className="mb-6 flex justify-center">
  <img
    src={logo}
    alt="LMS Logo"
    className="h-auto w-auto object-contain" // ← Change h-12 or set a custom height
  />
</div>
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

export default Sidebar;
