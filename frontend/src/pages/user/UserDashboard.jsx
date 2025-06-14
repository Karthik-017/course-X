import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EC4899", "#06B6D4", "#10B981", "#A855F7"];

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    purchasedCourses: [],
    activeCourses: [],
    completedCourses: [],
    courseProgress: [],
    recentCourses: [],
  });
  const [progressOverTime, setProgressOverTime] = useState([]);
  const [progressFilter, setProgressFilter] = useState("days");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setUnauthorized(true);
    setLoading(false);
    return;
  }

  try {
    const res = await API.get("/user/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setDashboardData(res.data);
    setProgressOverTime([]); // or extract data if needed
  } catch (err) {
    console.error("User dashboard error:", err.response?.status, err.response?.data);
    if (err.response?.status === 401 || err.response?.status === 403) {
      setUnauthorized(true);
    }
  }
  setLoading(false);
};


    fetchDashboard();
  }, [progressFilter]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (unauthorized) return <div className="p-6 text-red-500 font-semibold">Unauthorized Access</div>;

  const { purchasedCourses, activeCourses, completedCourses, courseProgress, recentCourses } = dashboardData;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Line Chart: Progress Over Time */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Progress Over Time</h2>
            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#06B6D4"
                activeDot={{ r: 8 }}
                name="Course Progress"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Course Progress Distribution */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Course Progress Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseProgress}
                dataKey="progress"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {courseProgress.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg">Purchased Courses</h3>
          <p className="text-2xl font-bold">{purchasedCourses.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg">Active Courses</h3>
          <p className="text-2xl font-bold">{activeCourses.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg">Completed Courses</h3>
          <p className="text-2xl font-bold">{completedCourses.length}</p>
        </div>
      </div>

      {/* Recent Courses */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Recent Courses</h2>
        {recentCourses.length === 0 ? (
          <p>No recent courses available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description?.substring(0, 60)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;