import { createContext, useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInterceptor";

export const SpecialSaleContext = createContext();

// Relative paths — axiosInstance already has baseURL configured
const SPECIAL_SALE_URL = "/specialsale";
const BANNER_URL = "/specialsale/banner";

export const SpecialSaleProvider = ({ children }) => {
  const [specialSales, setSpecialSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bannerText, setBannerText] = useState("");
  const [loadingBanner, setLoadingBanner] = useState(true);

  const fetchSpecialSales = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(SPECIAL_SALE_URL);
      setSpecialSales(res.data || []);
    } catch (err) {
      console.error("Error fetching special sales:", err);
      setSpecialSales([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanner = async () => {
    try {
      setLoadingBanner(true);
      const res = await axiosInstance.get(BANNER_URL);
      setBannerText(res.data?.banner || "");
    } catch (err) {
      console.error("Error fetching banner:", err);
      setBannerText("");
    } finally {
      setLoadingBanner(false);
    }
  };

  const updateBanner = async (newText) => {
    try {
      const res = await axiosInstance.put(BANNER_URL, { banner: newText });
      setBannerText(res.data?.banner || newText);
      return res.data;
    } catch (err) {
      console.error("Error updating banner:", err);
      throw err;
    }
  };

  const createSpecialSale = async (formData) => {
    const res = await axiosInstance.post(SPECIAL_SALE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const updateSpecialSale = async (id, formData) => {
    const res = await axiosInstance.put(`${SPECIAL_SALE_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const deleteSpecialSale = async (id) => {
    await axiosInstance.delete(`${SPECIAL_SALE_URL}/${id}`);
  };

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
        createSpecialSale,
        updateSpecialSale,
        deleteSpecialSale,
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
