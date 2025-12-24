import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InAdmin.css";

const BACKEND_URL = "https://nishat-api.vercel.app";

export default function InventoryDashboard() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  const fetchInventory = async () => {
    try {
      const { data: allProducts } = await axios.get(`${BACKEND_URL}/products`);

      const productsWithStock = allProducts.map((p) => {
        const totalStock = (p.batches || []).reduce(
          (acc, b) => acc + (Number(b.stock) || 0),
          0
        );

        const minPrice =
          p.batches && p.batches.length > 0
            ? Math.min(
                ...p.batches.map((b) => Number(b.price) || Infinity)
              )
            : "-";

        // sold hum product.sold se lenge
        const totalSold = Number(p.sold) || 0;

        return { ...p, totalStock, totalSold, minPrice };
      });

      setProducts(productsWithStock);

      // Out of Stock
      setOutOfStock(productsWithStock.filter((p) => p.totalStock === 0));

      //  Low Stock (1–5)
      setLowStock(
        productsWithStock.filter(
          (p) => p.totalStock > 0 && p.totalStock <= 5
        )
      );

      //  Top Selling (sold > 0, sorted)
      setTopSelling(
        [...productsWithStock]
          .filter((p) => p.totalSold > 0)
          .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
          .slice(0, 10)
      );
    } catch (err) {
      console.error("Error fetching inventory data:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const renderProductRow = (product) => (
    <tr key={product._id}>
      <td>
        {product.images && product.images.length > 0 ? (
          <img
            src={`${BACKEND_URL}${product.images[0]}`}
            alt={product.name}
            width={50}
            style={{ borderRadius: "4px" }}
          />
        ) : (
          "No Image"
        )}
      </td>
      <td>{product.name}</td>
      <td>{product.category || "-"}</td>
      <td>{product.subCategory || "-"}</td>
      <td>{product.minPrice}</td>
      <td>{product.totalStock}</td>
      <td>{product.totalSold || 0}</td>
      <td>{product.totalStock - (product.totalSold || 0)}</td>
      <td>
        {product.generalSizes && product.generalSizes.length > 0
          ? product.generalSizes.join(", ")
          : "-"}
      </td>
    </tr>
  );

  return (
    <div className="inventory-dashboard">
      <h2>Inventory Management</h2>

      {/* ===== 1) Top Selling Table ===== */}
      <section style={{ marginBottom: "32px" }}>
        <h3>Top Selling Products</h3>
        {topSelling.length === 0 ? (
          <p>No top selling products yet.</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Remaining</th>
                <th>Sizes</th>
              </tr>
            </thead>
            <tbody>{topSelling.map(renderProductRow)}</tbody>
          </table>
        )}
      </section>

      {/* ===== 2) Out of Stock Table ===== */}
      <section style={{ marginBottom: "32px" }}>
        <h3>Out of Stock Products</h3>
        {outOfStock.length === 0 ? (
          <p>No out of stock products.</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Remaining</th>
                <th>Sizes</th>
              </tr>
            </thead>
            <tbody>{outOfStock.map(renderProductRow)}</tbody>
          </table>
        )}
      </section>

      {/* ===== 3) Low Stock Table ===== */}
      <section style={{ marginBottom: "32px" }}>
        <h3>Low Stock Products (≤5)</h3>
        {lowStock.length === 0 ? (
          <p>No low stock products.</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Remaining</th>
                <th>Sizes</th>
              </tr>
            </thead>
            <tbody>{lowStock.map(renderProductRow)}</tbody>
          </table>
        )}
      </section>

      {/* ===== Full Products Table ===== */}
      <div className="inventory-table-wrapper">
        <h3>All Products</h3>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Remaining</th>
              <th>Sizes</th>
            </tr>
          </thead>
          <tbody>{products.map(renderProductRow)}</tbody>
        </table>
      </div>
    </div>
  );
}
