import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EC4899", "#06B6D4", "#10B981", "#A855F7"];

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [recentCourses, setRecentCourses] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [popularCourses, setPopularCourses] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [growthFilter, setGrowthFilter] = useState("days");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [dashboardRes, userGrowthRes] = await Promise.all([
          API.get("/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get(`/admin/user-growth?filter=${growthFilter}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const data = dashboardRes.data;

        setOverview(data.overview);
        setRecentCourses(data.recentCourses);
        setTopCourses(data.topCourses);
        setTotalUsers(data.totalUsers);
        setTotalPurchases(data.totalPurchases);
        setTotalRevenue(data.totalRevenue);
        setPopularCourses(data.popularCourses);
        setUserGrowth(userGrowthRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.status === 401) setUnauthorized(true);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, growthFilter]);

  const overviewData = [
    { name: "Courses", value: overview.totalCourses || 0 },
    { name: "Sections", value: overview.totalSections || 0 },
    { name: "Contents", value: overview.totalContents || 0 },
  ];

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (unauthorized) return <div className="p-6 text-red-500 font-semibold">Unauthorized: Admin access only</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Growth Line Chart with Filter */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">User Growth Over Time</h2>
            <select
              value={growthFilter}
              onChange={(e) => setGrowthFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                activeDot={{ r: 8 }}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Courses Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Course Purchase Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={popularCourses}
                dataKey="purchaseCount"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {popularCourses.map((entry, index) => (
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
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg">Total Users</h3>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg">Total Purchases</h3>
          <p className="text-2xl font-bold">{totalPurchases}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg">Total Revenue</h3>
          <p className="text-2xl font-bold">₹ {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Courses */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Recent Courses</h2>
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {recentCourses.map((course) => (
            <li key={course.id}>
              {course.title} — ₹{course.price}
            </li>
          ))}
        </ul>
      </div>

      {/* Top Courses */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Top Courses</h2>
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {topCourses.map((course) => (
            <li key={course.id}>
              {course.title} — {course.contentCount} contents
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Courses List */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Popular Courses</h2>
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {popularCourses.map((course) => (
            <li key={course.id}>
              {course.title} — {course.purchaseCount} purchases
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;