// App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

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
import { CategoryProvider } from "./Admin/context/CategoryContext";
import CategoryPage from "./Main/pages/CategoryPage";
import CartProvider from "./Main/components/context/CartContext"
import Cart from "./Main/pages/cart";
import ThankYou from "./Main/pages/ThankYou";
import Wishlist from "./Main/components/Wishlist";
import User from "./Main/pages/User";
import ProductDetail from "./Main/pages/ProductDetail";
import ProtectedRoute from "./Main/components/ProtectedRoute";
import Login from "./Main/components/Login";
import Newsletter from "./Admin/Admincomponents/NewsletterAdmin";
import Contact from "./Main/pages/contact";
import ContactAdmin from "./Admin/Admincomponents/Users";
import AboutUs from "./Main/pages/Aboutus";
import PrivacyPolicy from "./Main/components/privacypolicy";
import Signup from "./Main/components/Signup";
import ForgotPassword from "./Main/components/ForgotPassword";
import ResetPassword from "./Main/components/ResetPassword";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home /> },
        // { path:"/" ,element: <CategoryCarousel />},
        {path:"/category/:categoryName" ,element:<CategoryPage />},
         {path:"/category/:categoryName/:subName" ,element:<CategoryPage />},
        {path:"cart",element:<Cart/>},
        // {path:"checkout",element:<Checkout/>},
        {path:"thank-you",element:<ThankYou/>},
        {path:"wishlist",element:<Wishlist/>},
        {path:"product/:id",element:<ProductDetail/>},
        {path:"contact",element:<Contact/>},
        {path:"/about-us",element:<AboutUs/>},
        {path:"/privacy-policy",element:<PrivacyPolicy/>},
    
        {
          path: "/User",
          element: (
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          ),
        },
      ],
    },
        { path: "/Login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <ResetPassword /> },  
        {path:"/signup",element:<Signup/>},
     {path:"checkout",element:<Checkout/>},
    { path: "/dashboard/login", element: <AdminLogin /> },
    {
      path: "/dashboard",
      element: <AdminLayout />,
      children: [
        // { path: "", element: <Admin /> },
        { path: "products", element: <ProductUpload /> },
        { path: "category", element: <AdminCategory /> }, 
        { path: "orders", element: <Orders /> },
        { path: "users", element: <ContactAdmin /> },
        { path: "orderdetail/:id", element: <OrderDetail /> },
        { path: "newsletter", element: <Newsletter /> },
      ],
    },
  ]);

  return (
    <CategoryProvider>
      
      <CartProvider>
      <RouterProvider router={router} />
      </CartProvider>
    </CategoryProvider>
  );
}

export default App;
