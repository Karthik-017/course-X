import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout"

import "./index.css";

import Dashboard from "./pages/Dashboard";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminSignin from "./pages/admin/AdminSignin";
import CreateEditCourse from "./pages/admin/CreateEditCourse";
import MyCourses from "./pages/admin/MyCourses";
import CourseDetails from "./pages/courses/CourseDetails";

import UserSignup from "./pages/user/UserSignup";
import UserSignin from "./pages/user/UserSignin";
import MyPurchases from "./pages/user/MyPurchases";
import MyProfile from "./pages/user/MyProfile";

import CourseListingPage from "./pages/courses/CourseListingPage";

import Certificate from "./pages/Certificate";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";





const App = () => {
  return (
    
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Admin */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/signin" element={<AdminSignin />} />
          <Route path="/admin/courses" element={<CreateEditCourse />} />
          <Route path="/admin/courses/edit/:courseId" element={<CreateEditCourse />} />
          <Route path="/admin/my-courses" element={<MyCourses />} />
    
          {/* User */}
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/signin" element={<UserSignin />} />
          <Route path="/user/purchases" element={<MyPurchases />} />
          <Route path="/user/profile"element={<MyProfile />}/>
      
          {/* Courses */}
          <Route path="/courses/CourseListingPage"element={<CourseListingPage />}/>
           <Route path="/course/:id" element={<CourseDetails />} />
          {/* Other */}
          <Route path="/certificates" element={<Certificate />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    
  );
};

export default App;
