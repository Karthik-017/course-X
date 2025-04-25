import { Link, Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 bg-white p-6 shadow-md">
        <nav className="space-y-6 text-gray-700 font-medium">
          <Link to="/" className="block text-xl font-bold text-blue-600">Dashboard</Link>

          <div>
            <div className="mb-2 text-sm text-gray-500 uppercase">Admin</div>
            <Link to="/admin/signup" className="block hover:text-blue-500">Signup</Link>
            <Link to="/admin/signin" className="block hover:text-blue-500">Signin</Link>
            <Link to="/admin/courses/create" className="block hover:text-blue-500">Create/Edit Course</Link>
            <Link to="/admin/courses" className="block hover:text-blue-500">My Courses</Link>
          </div>

          <div>
            <div className="mb-2 text-sm text-gray-500 uppercase">User</div>
            <Link to="/user/signup" className="block hover:text-blue-500">Signup</Link>
            <Link to="/user/signin" className="block hover:text-blue-500">Signin</Link>
            <Link to="/user/purchases" className="block hover:text-blue-500">My Purchases</Link>
          </div>

          <div>
            <div className="mb-2 text-sm text-gray-500 uppercase">Courses</div>
            <Link to="/courses" className="block hover:text-blue-500">Public Preview</Link>
            <Link to="/courses/purchase" className="block hover:text-blue-500">Purchase Flow</Link>
          </div>

          <div>
            <div className="mb-2 text-sm text-gray-500 uppercase">Others</div>
            <Link to="/certificate" className="block hover:text-blue-500">Certificate</Link>
            <Link to="/rewards" className="block hover:text-blue-500">Rewards</Link>
            <Link to="/settings" className="block hover:text-blue-500">Settings</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
