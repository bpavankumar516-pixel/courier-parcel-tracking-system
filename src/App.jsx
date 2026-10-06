import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { CustomerProvider } from './context/CustomerContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import CustomersPage from './pages/CustomersPage';

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <CustomerProvider>
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
              <Route path="/tracking" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/status" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </CustomerProvider>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;
