import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";
import { getImageUrl } from "../../config/api";
import "./InAdmin.css";

export default function InventoryDashboard() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data: allProducts } = await axiosInstance.get("/products");

      const enriched = allProducts.map((p) => ({
        ...p,
        totalStock: (p.batches || []).reduce((acc, b) => acc + (Number(b.stock) || 0), 0),
        totalSold:  Number(p.sold) || 0,
        minPrice:   p.batches?.length > 0
          ? Math.min(...p.batches.map(b => Number(b.price) || Infinity))
          : null,
      }));

      setProducts(enriched);
      setOutOfStock(enriched.filter(p => p.totalStock === 0));
      setLowStock(enriched.filter(p => p.totalStock > 0 && p.totalStock <= 5));
      setTopSelling([...enriched].filter(p => p.totalSold > 0).sort((a, b) => b.totalSold - a.totalSold).slice(0, 10));
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const tableHeaders = (
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Sold</th>
        <th>Sizes</th>
      </tr>
    </thead>
  );

  const stockBadge = (stock) => {
    if (stock === 0) return <span className="stock-badge zero">Out of Stock</span>;
    if (stock <= 5)  return <span className="stock-badge low">{stock} left</span>;
    return <span className="stock-badge ok">{stock}</span>;
  };

  const renderRow = (p) => (
    <tr key={p._id}>
      <td>
        {p.images?.length > 0
          ? <img src={getImageUrl(p.images[0])} alt={p.name} />
          : <span style={{ color: "#94a3b8", fontSize: 12 }}>No image</span>}
      </td>
      <td style={{ fontWeight: 600, color: "#0f172a" }}>{p.name}</td>
      <td>{p.category || "—"}</td>
      <td>{p.minPrice && p.minPrice !== Infinity ? `Rs ${p.minPrice.toLocaleString()}` : "—"}</td>
      <td>{stockBadge(p.totalStock)}</td>
      <td>{p.totalSold || 0}</td>
      <td>{p.generalSizes?.length > 0 ? p.generalSizes.join(", ") : "—"}</td>
    </tr>
  );

  if (loading) return <div style={{ padding: 40, color: "#94a3b8", fontFamily: "Poppins" }}>Loading inventory...</div>;

  return (
    <div className="inventory-dashboard">
      <h2>Inventory Management</h2>

      {/* Top Selling */}
      <section className="inventory-section top-selling">
        <h3>🏆 Top Selling Products</h3>
        {topSelling.length === 0 ? (
          <p className="inventory-empty">No products sold yet.</p>
        ) : (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              {tableHeaders}
              <tbody>{topSelling.map(renderRow)}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* Out of Stock */}
      <section className="inventory-section out-of-stock">
        <h3>🚫 Out of Stock</h3>
        {outOfStock.length === 0 ? (
          <p className="inventory-empty">All products are in stock.</p>
        ) : (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              {tableHeaders}
              <tbody>{outOfStock.map(renderRow)}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* Low Stock */}
      <section className="inventory-section low-stock">
        <h3>⚠️ Low Stock (≤5 units)</h3>
        {lowStock.length === 0 ? (
          <p className="inventory-empty">No low stock items.</p>
        ) : (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              {tableHeaders}
              <tbody>{lowStock.map(renderRow)}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* All Products */}
      <section className="inventory-section all-products">
        <h3>📦 All Products ({products.length})</h3>
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            {tableHeaders}
            <tbody>{products.map(renderRow)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
