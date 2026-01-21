// src/Admin/context/SpecialSaleContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export const SpecialSaleContext = createContext();

const BACKEND_URL = `${API_BASE_URL}/specialsale`;
const BANNER_URL = `${API_BASE_URL}/specialsale/banner`;

export const SpecialSaleProvider = ({ children }) => {
  const [specialSales, setSpecialSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== BANNER STATE =====
  const [bannerText, setBannerText] = useState("");
  const [loadingBanner, setLoadingBanner] = useState(true);

  // ===== FETCH SPECIAL SALES =====
  const fetchSpecialSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BACKEND_URL);
      setSpecialSales(res.data || []);
    } catch (err) {
      console.error("Error fetching special sales:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH BANNER =====
  const fetchBanner = async () => {
    try {
      setLoadingBanner(true);
      const res = await axios.get(BANNER_URL);
      setBannerText(res.data?.banner || "");
    } catch (err) {
      console.error("Error fetching banner:", err);
    } finally {
      setLoadingBanner(false);
    }
  };

  // ===== UPDATE BANNER (ADMIN USES THIS) =====
  const updateBanner = async (newText) => {
    try {
      const res = await axios.put(BANNER_URL, { banner: newText });
      setBannerText(res.data?.banner || newText);
      return res.data;
    } catch (err) {
      console.error("Error updating banner:", err);
      throw err;
    }
  };

  // initial load
  useEffect(() => {
    fetchSpecialSales();
    fetchBanner();
  }, []);

  return (
    <SpecialSaleContext.Provider
      value={{
        specialSales,
        fetchSpecialSales,
        loading,

        // banner
        bannerText,
        loadingBanner,
        fetchBanner,
        updateBanner,
      }}
    >
      {children}
    </SpecialSaleContext.Provider>
  );
};
