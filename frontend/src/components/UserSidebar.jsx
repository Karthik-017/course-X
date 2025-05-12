import { NavLink } from "react-router-dom";

const UserSidebar = () => {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "User Signup", path: "/user/signup" },
    { label: "User Signin", path: "/user/signin" },
    { label: "My Profile", path: "/user/profile" },
    { label: "My Purchases", path: "/user/purchases" },
    { label: "Public Courses", path: "/courses/preview" },
    { label: "Purchase Course", path: "/courses/purchase" },
    { label: "Certificates", path: "/certificates" },
    { label: "Rewards", path: "/rewards" },
    { label: "Settings", path: "/settings" },
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

export default UserSidebar;
