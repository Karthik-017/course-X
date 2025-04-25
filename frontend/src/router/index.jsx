import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout";

// Temporary placeholder components
const Dashboard = () => <div>Dashboard</div>;

// Admin Pages
const AdminSignup = () => <div>Admin Signup</div>;
const AdminSignin = () => <div>Admin Signin</div>;
const CreateEditCourse = () => <div>Create/Edit Course</div>;
const AdminCourses = () => <div>Admin Courses</div>;

// User Pages
const UserSignup = () => <div>User Signup</div>;
const UserSignin = () => <div>User Signin</div>;
const MyPurchases = () => <div>My Purchases</div>;

// Courses
const PublicCourses = () => <div>Public Course Preview</div>;
const PurchaseFlow = () => <div>Purchase Flow</div>;

// Others
const Certificate = () => <div>Certificate (TBD)</div>;
const Rewards = () => <div>Rewards (TBD)</div>;
const Settings = () => <div>Settings (TBD)</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          {/* Admin Routes */}
          <Route path="admin/signup" element={<AdminSignup />} />
          <Route path="admin/signin" element={<AdminSignin />} />
          <Route path="admin/courses/create" element={<CreateEditCourse />} />
          <Route path="admin/courses" element={<AdminCourses />} />

          {/* User Routes */}
          <Route path="user/signup" element={<UserSignup />} />
          <Route path="user/signin" element={<UserSignin />} />
          <Route path="user/purchases" element={<MyPurchases />} />

          {/* Course Routes */}
          <Route path="courses" element={<PublicCourses />} />
          <Route path="courses/purchase" element={<PurchaseFlow />} />

          {/* Other Routes */}
          <Route path="certificate" element={<Certificate />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
// This code sets up a basic routing structure for a React application using React Router.