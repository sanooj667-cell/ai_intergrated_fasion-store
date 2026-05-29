import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

import AdminRoute from "../components/AdminRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import OrderDetail from "../pages/OrderDetail";
import Orders from "../pages/Orders";
import TrackOrder from "../pages/TrackOrder";
import Addresses from "../pages/Addresses";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/Profile";
import ProductDetailPage from "../pages/ProductDetailPage";
import Register from "../pages/Register";
import ShopPage from "../pages/ShopPage";
import AdminDashboard from "../pages/AdminDashboard";
import TryOn from "../pages/TryOn";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/shop"
            element={
              <PageTransition>
                <ShopPage />
              </PageTransition>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageTransition>
                <ProductDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/addresses"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/track-order/:tracking_id"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/orders"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/tryon"
            element={
              <PageTransition>
                <ProtectedRoute>
                  <TryOn />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/admin"
            element={
              <PageTransition>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
