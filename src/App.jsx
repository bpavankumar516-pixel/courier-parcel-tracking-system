import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { CustomerProvider } from './context/CustomerContext';
import { SupportProvider } from './context/SupportContext';

import SupportChatDrawer from './components/common/SupportChatDrawer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import CustomersPage from './pages/CustomersPage';
import ParcelTrackingPage from './pages/ParcelTrackingPage';
import ReportsPage from './pages/ReportsPage';
import DeliveryStatusPage from './pages/DeliveryStatusPage';

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <CustomerProvider>
          <SupportProvider>
            <Router>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <SupportChatDrawer />
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/shipments"
                  element={
                    <ProtectedRoute>
                      <ShipmentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <CustomersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Secondary Sub-route Fallbacks */}
                <Route path="/tracking" element={<ProtectedRoute><ParcelTrackingPage /></ProtectedRoute>} />
                <Route path="/status" element={<ProtectedRoute><DeliveryStatusPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </SupportProvider>
        </CustomerProvider>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;
