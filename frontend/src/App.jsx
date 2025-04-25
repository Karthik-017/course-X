import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout"

import "./index.css";

import Dashboard from "./pages/Dashboard";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminSignin from "./pages/admin/AdminSignin";
import CreateEditCourse from "./pages/admin/CreateEditCourse";
import MyCourses from "./pages/admin/MyCourses";

import UserSignup from "./pages/user/UserSignup";
import UserSignin from "./pages/user/UserSignin";
import MyPurchases from "./pages/user/MyPurchases";

import PublicPreview from "./pages/courses/PublicPreview";
import PurchaseCourse from "./pages/courses/PurchaseCourse";

import Certificate from "./pages/Certificate";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";

import UserSettings from "./pages/user/UserSettings";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Admin */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/signin" element={<AdminSignin />} />
          <Route path="/admin/courses" element={<CreateEditCourse />} />
          <Route path="/admin/my-courses" element={<MyCourses />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* User */}
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/signin" element={<UserSignin />} />
          <Route path="/user/purchases" element={<MyPurchases />} />
          <Route path="/user/settings" element={<UserSettings />} />
          {/* Courses */}
          <Route path="/courses/preview" element={<PublicPreview />} />
          <Route path="/courses/purchase" element={<PurchaseCourse />} />
          {/* Other */}
          <Route path="/certificates" element={<Certificate />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
