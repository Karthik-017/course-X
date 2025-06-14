import React, { useEffect, useState } from "react";
import API from "../../api";

const MyProfile = () => {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    username: "",
    occupation: ""
  });

  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    github: "",
    linkedin: ""
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editSocialMode, setEditSocialMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch user profile
        const response = await API.get("http://localhost:8000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set user data
        setUser({
          email: response.data.user.email || "",
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          phone: response.data.user.phone || "",
          bio: response.data.user.bio || "",
          username: response.data.user.username || "",
          occupation: response.data.user.occupation || "Not specified"
        });

        // Fetch social links
        const socialResponse = await API.get("http://localhost:8000/user/me/socials", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set social links data
        setSocialLinks({
          twitter: socialResponse.data.socialLinks?.twitter || "",
          github: socialResponse.data.socialLinks?.github || "",
          linkedin: socialResponse.data.socialLinks?.linkedin || ""
        });

        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const updateSocialLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        "http://localhost:8000/user/me/socials",
        socialLinks,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Social links updated successfully!");
      setEditSocialMode(false);
    } catch (error) {
      console.error("Error updating social links:", error);
      alert(error.response?.data?.message || "Failed to update social links");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">First Name: </span>
              <span className="text-gray-800">{user.firstName || "Not provided"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Name: </span>
              <span className="text-gray-800">{user.lastName || "Not provided"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Username: </span>
              <span className="text-gray-800">{user.username || "Not set"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Occupation: </span>
              <span className="text-gray-800">{user.occupation}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
          <div>
            <span className="font-medium text-gray-600">Email: </span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Phone: </span>
            <span className="text-gray-800">{user.phone || "Not provided"}</span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-800">Bio</h3>
            <p className="text-gray-800">{user.bio}</p>
          </div>
        )}

        {/* Social Links */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Social Links</h3>
            {!editSocialMode ? (
              <button 
                onClick={() => setEditSocialMode(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={updateSocialLinks}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditSocialMode(false)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editSocialMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  placeholder="Twitter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">GitHub</label>
                <input
                  type="text"
                  name="github"
                  value={socialLinks.github}
                  onChange={handleSocialLinkChange}
                  placeholder="GitHub username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={socialLinks.linkedin}
                  onChange={handleSocialLinkChange}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              {socialLinks.twitter ? (
                <a 
                  href={`https://twitter.com/${socialLinks.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600"
                >
                  Twitter
                </a>
              ) : (
                <span className="text-gray-400">Twitter not set</span>
              )}
              
              {socialLinks.github ? (
                <a 
                  href={`https://github.com/${socialLinks.github}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-black"
                >
                  GitHub
                </a>
              ) : (
                <span className="text-gray-400">GitHub not set</span>
              )}
              
              {socialLinks.linkedin ? (
                <a 
                  href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  LinkedIn
                </a>
              ) : (
                <span className="text-gray-400">LinkedIn not set</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;