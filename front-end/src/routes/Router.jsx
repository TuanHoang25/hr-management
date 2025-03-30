import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../layouts/loader/Loader";
import PrivateRoute from "../utils/PrivateRoute";
import RoleBaseRoute from "../utils/RoleBaseRoute";
import DashboardContent from "../views/admin-page/DashboardContent";
import Attendance from "../components/EmployeeFunction/Attendence";
import Apply from "../views/applicant-page/Apply";
import Employees from "../components/AdminFunction/Employees/Employees";
import CreateEmployees from "../components/AdminFunction/Employees/CreateEmployees";
import Profile from "../components/EmployeeFunction/Profile";
import LandingPage from "../views/applicant-page/LandingPage";
import AdminApplication from "../components/AdminFunction/Applications/AdminApplication";
import Unauthorized from "../utils/Unauthorized";
import Departments from "../components/AdminFunction/Departments/Departments";
import AttendanceManager from "../components/AdminFunction/Attendance/AttendanceManager";
import Leave from "../components/EmployeeFunction/Leave";
import LeaveManager from "../components/AdminFunction/LeavesManager/LeaveManager";
import Weather from "../components/EmployeeFunction/Weather";
import DistanceCalculator from "../components/EmployeeFunction/DistanceCalculator";
import CreateWork from "../components/AdminFunction/WorksManager/CreateWork";
import ListWork from "../components/AdminFunction/WorksManager/ListWork";
import MyTasks from "../components/EmployeeFunction/MyTask";
const Login = lazy(() => import("../views/login-page/Login"));
const Dashboard = lazy(() => import("../layouts/FullLayout"));
const DashboardEmployee = lazy(() =>
  import("../layouts_employee/FullLayoutEmployee")
);
const Router = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/admin-dashboard" />} /> */}
        <Route path="*" element={<LandingPage />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <RoleBaseRoute requiredRole={["admin"]}>
                <Dashboard />
              </RoleBaseRoute>
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardContent />} />
          <Route path="departments" element={<Departments />} />
          <Route path="create-departments" element={<createDepartments />} />
          <Route path="employees" element={<Employees />} />
          <Route path="create-employees" element={<CreateEmployees />} />
          <Route path="applicants" element={<AdminApplication />} />
          <Route path="attendanceManager" element={<AttendanceManager />} />
          <Route path="leave-manager" element={<LeaveManager />} />
          <Route path="task-manager" element={<CreateWork />} />
          <Route path="list-tasks" element={<ListWork />} />
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute>
              <RoleBaseRoute requiredRole={["user"]}>
                <DashboardEmployee />
              </RoleBaseRoute>
            </PrivateRoute>
          }
        >
          {/* test thử notification bell */}
          <Route index element={<Weather />} />
          <Route
            path="/employee-dashboard/Attendence"
            element={<Attendance />}
          />
          <Route path="/employee-dashboard/leave" element={<Leave />} />
          <Route path="/employee-dashboard/profile/:id" element={<Profile />} />
          <Route
            path="/employee-dashboard/googlemaps"
            element={<DistanceCalculator />}
          />
          <Route path="/employee-dashboard/task" element={<MyTasks />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
