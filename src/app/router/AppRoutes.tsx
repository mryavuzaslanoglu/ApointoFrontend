import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/widgets/auth/AuthLayout";
import { MainShell } from "@/widgets/app/MainShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { BusinessSettingsPage } from "@/pages/business/BusinessSettingsPage";
import { StaffManagementPage } from "@/pages/staff/StaffManagementPage";
import { ServiceCatalogPage } from "@/pages/services/ServiceCatalogPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <MainShell />
          </ProtectedRoute>
        )}
      >
        <Route index element={<DashboardPage />} />
        <Route path="business" element={<BusinessSettingsPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="services" element={<ServiceCatalogPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

