// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Footer from "./component/Footer";
import ProductDetail from "./component/ProductDetail";
import Products from "./component/Products";
import { CartProvider } from "./context/CartContext";
import Cart from "./context/Cart";
import ScrollToTop from "./component/ScrollToTop";
import Checkout from "./context/Checkout";
import LoginWithOTP from "./component/LoginWithOTP";
import Address from "./component/Address";
import Contact from "./component/Contact";
import AdminDashboard from "./admin/AdminDashboard";
import OrderConfirmation from "./component/OrderConfirmation";
import CreateOrder from "./admin/CreateOrder";

// Import AuthProvider and ProtectedRoute
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./component/ProtectedRoute";
import ProductList from "./admin/components/ProductList.jsx";
import ProductDetails from "./component/ProductDetails.jsx";
import UserDashboard from "./component/UserDashboard.jsx";
import PremiumCashewManager from "./admin/PremiumCashewManager.jsx";
import ViewUsers from "./admin/ViewUsers.jsx";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <RouteLayout />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// Layout component that conditionally hides header/footer on certain admin pages
function RouteLayout() {
  const location = useLocation();
  // Hide header/footer for all /admin routes
  const hideHeaderFooter = location.pathname.startsWith("/admin/");

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products/:productId?" element={<Products />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/productdetails" element={<ProductDetails />} />
          <Route path="/login" element={<LoginWithOTP />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes (Require Login) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Order Management Route */}
          {/* <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateOrder />
              </ProtectedRoute>
            }
          /> */}

          {/* Product Management Route */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductList />
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
            path="/admin/premium-cashews"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PremiumCashewManager />
              </ProtectedRoute>
            }
          />

          {/* View Users Route */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ViewUsers />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
