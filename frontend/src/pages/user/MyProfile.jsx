import React, { useEffect, useState } from "react";
import API from "../../api";

const MyProfile = () => {
  const [user, setUser] = useState({
        "email": "",
        "firstName": "",
        "lastName": ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await API.get("http://localhost:8000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract user object from response
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


if(loading){
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
}

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium">First Name: </span>
          <span>{user.firstName}</span>
        </div>
        <div>
          <span className="font-medium">Last Name: </span>
          <span>{user.lastName}</span>
        </div>
        <div>
          <span className="font-medium">Email: </span>
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
