import { useEffect, useState } from "react";
import API from "../../api";
import CourseCard from "../../components/CourseCard"; // Adjust the path as needed

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("http://localhost:8000/user/purchases", {
          headers: { Authorization: token }
        });
        setPurchases(res.data.purchases);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load purchases");
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {purchases.map((purchase) => (
          <CourseCard key={purchase.course.id} course={purchase.course} />
        ))}
      </div>
    </div>
  );
};

export default MyPurchases;
