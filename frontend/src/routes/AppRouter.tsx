import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import BoardPage from "../pages/Board/BoardPage";
import LoginPage from "../pages/Auth/LoginPage";
import MyHoursPage from "../pages/MyHours/MyHoursPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<BoardPage />} />
          <Route path="/my-hours" element={<MyHoursPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Redirect */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;