import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CreateOrder from "./CreateOrder";


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
</Routes>
  )
}