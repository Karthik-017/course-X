import React, { useEffect, useState } from "react";
import API from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [overview, setOverview] = useState({});
  const [recentCourses, setRecentCourses] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          overviewRes,
          recentRes,
          topRes,
          usersRes,
          purchasesRes,
          revenueRes,
          popularRes,
        ] = await Promise.all([
          API.get("/admin/dashboard/overview"),
          API.get("/admin/dashboard/recent-courses"),
          API.get("/admin/dashboard/top-courses"),
          API.get("/admin/dashboard/total-users"),
          API.get("/admin/dashboard/total-purchases"),
          API.get("/admin/dashboard/total-revenue"),
          API.get("/admin/dashboard/popular-courses"),
        ]);

        setOverview(overviewRes.data);
        setRecentCourses(recentRes.data);
        setTopCourses(topRes.data);
        setTotalUsers(usersRes.data.totalUsers);
        setTotalPurchases(purchasesRes.data.totalPurchases);
        setTotalRevenue(revenueRes.data.totalRevenue);
        setPopularCourses(popularRes.data.popularCourses);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const overviewData = [
    { name: "Courses", value: overview.totalCourses || 0 },
    { name: "Sections", value: overview.totalSections || 0 },
    { name: "Contents", value: overview.totalContents || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Overview Bar Graph */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Users / Purchases / Revenue Summary */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Top Courses by Content */}
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

      {/* Popular Courses by Purchases */}
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

export default Dashboard;
