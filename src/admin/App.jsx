import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../component/ProtectedRoute";
import CreateOrder from "./CreateOrder";
import ProductList from "./admin/components/ProductList.jsx";
import PremiumCashewManager from "./admin/components/premiumcashew/PremiumCashewManager.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/premium-cashew"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PremiumCashewManager />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;