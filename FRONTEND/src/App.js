import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./utils/axiosInterceptor"; // Initialize axios interceptor for token refresh
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./Main/pages/Home";
import AppLayout from "./Main/components/Applayout";
import AdminLayout from "./Admin/Admincomponents/Adminlayout";
import Checkout from "./Main/pages/Checkout";
import ProductUpload from "./Admin/Admincomponents/ProductUpload";
import AdminLogin from "./Admin/Admincomponents/adminlogin";
import Orders from "./Admin/Admincomponents/Order";
import Users from "./Admin/Admincomponents/Users";
import OrderDetail from "./Admin/Admincomponents/Orderdetail";
import AdminCategory from "./Admin/Admincomponents/Admincategory";
import AdminSpecialSale from "./Admin/Admincomponents/AdminSpecialSale";
import AdminCarousel from "./Admin/Admincomponents/AdminCarousel";
import { CategoryProvider } from "./Admin/context/CategoryContext";
import { SpecialSaleProvider } from "./Admin/context/SpecialSaleContext";
import { CarouselProvider } from "./Admin/context/CarouselContext";
import CategoryPage from "./Main/pages/CategoryPage";
import CartProvider from "./Main/components/context/CartContext";
import Cart from "./Main/pages/cart";
import ThankYou from "./Main/pages/ThankYou";
import Wishlist from "./Main/components/Wishlist";
import User from "./Main/pages/User";
import ProductDetail from "./Main/pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Main/components/Login";
import Unauthorized from "./components/Unauthorized";
import Newsletter from "./Admin/Admincomponents/NewsletterAdmin";
import Contact from "./Main/pages/contact";
import ContactAdmin from "./Admin/Admincomponents/Users";
import AboutUs from "./Main/pages/Aboutus";
import PrivacyPolicy from "./Main/components/privacypolicy";
import UserLogin from "./Admin/Admincomponents/user-login"; 
import SearchSidebar from "./Main/components/Filters";
import InventoryDashboard from "./Admin/Adminpages/InventoryDashboard";
import AdminUsers from "./Admin/Admincomponents/AdminUsers";

function App() {
  const router = createBrowserRouter([
    // Main frontend routes
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "category/:categoryName", element: <CategoryPage /> },
        { path: "category/:categoryName/:subName", element: <CategoryPage /> },
        { path: "cart", element: <Cart /> },
    
        { path: "thank-you", element: <ThankYou /> },
        { path: "wishlist", element: <Wishlist /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "contact", element: <Contact /> },
        { path: "about-us", element: <AboutUs /> },
        { path: "privacy-policy", element: <PrivacyPolicy /> },
        {path:"Filter", element:<SearchSidebar />},
        {
          path: "user",
          element: (
            <ProtectedRoute requiredRoles={['user']}>
              <User />
            </ProtectedRoute>
          ),
        },
      ],
      
    },
   { path: "checkout", element: <Checkout /> },
    { path: "/login", element: <Login /> },
    { path: "/unauthorized", element: <Unauthorized /> },

    // Admin routes
    {
      path: "/dashboard/login",
      element: <AdminLogin />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute requiredRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "products", element: <ProductUpload /> },
        { path: "category", element: <AdminCategory /> },
        { path: "specialsales", element: <AdminSpecialSale /> },
        { path: "carousel", element: <AdminCarousel /> },
        { path: "orders", element: <Orders /> },
        { path: "users", element: <ContactAdmin /> },
        // { path: "users-login", element: < UserLogin /> }, 
        { path: "admin-users", element: <AdminUsers /> },
        { path: "orderdetail/:id", element: <OrderDetail /> },
        { path: "newsletter", element: <Newsletter /> },
        {path: "inventory", element: <InventoryDashboard /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CategoryProvider>
        <SpecialSaleProvider>
          <CarouselProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </CarouselProvider>
        </SpecialSaleProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
