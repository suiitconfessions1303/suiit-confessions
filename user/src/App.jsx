
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import VerifyEmail from "./pages/VerifyEmail";
import VerificationPending from "./pages/VerificationPending";
import ConfessionForm from "./pages/ConfessionForm";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import {
  AdminRoute,
  AdminLoginRoute,
  SubmissionRoute,
  ThankYouRoute,
  VerificationRoute,
  VerificationPendingRoute,
} from "./routes/ProtectedRoute";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <VerificationRoute>
              <VerifyEmail />
            </VerificationRoute>
          }
        />
        <Route
          path="/confess"
          element={
            <SubmissionRoute>
              <ConfessionForm />
            </SubmissionRoute>
          }
        />
        <Route
          path="/verification-pending"
          element={
            <VerificationPendingRoute>
              <VerificationPending />
            </VerificationPendingRoute>
          }
        />
        <Route
          path="/thank-you"
          element={
            <ThankYouRoute>
              <ThankYou />
            </ThankYouRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminLoginRoute>
              <AdminLogin />
            </AdminLoginRoute>
          }
        />
        <Route
          path="/admin/inbox"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
