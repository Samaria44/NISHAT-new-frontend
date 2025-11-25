//C:\Users\samar\Desktop\GCS\NISHAT\FRONTEND\my-react-app\src\Main\components\Applayout.jsx
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
<> <Navbar/>
<Outlet/>
  <Footer />
</>
  );
}