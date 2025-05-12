import React from "react";

const MyProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    firstName: "",
    lastName: "",
    email: "",
  };

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
