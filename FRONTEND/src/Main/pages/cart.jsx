import { useState, useEffect } from "react";
import {FiTrash2} from "react-icons/fi";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const handleCheckout = () => navigate("/checkout");
  // Load cart from localStorage
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Increase quantity
  const handleIncrease = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease quantity
  const handleDecrease = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = Math.max(
      (updatedCart[index].quantity || 1) - 1,
      1
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove product
  const handleRemove = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  if (cartItems.length === 0)
    return <h2 className="empty-cart">Your cart is empty.</h2>;

  return (
    <div className="cart-page">
      <div className="heading">
        {" "}
        <h2>Shopping Cart</h2>
      </div>

      <table className="cart-table">
        <thead className="cart-head">
          <tr>
            <th className="cart-th">Product</th>
            <th className="cart-th">Price</th>
            <th className="cart-th">Quantity</th>
            <th className="cart-th">Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td data-label="Product" className="cart-product-cell">
                <img
                  src={
                    item.image
                      ? `http://localhost:8000${item.image}`
                      : "https://via.placeholder.com/60"
                  }
                  alt={item.name}
                  className="cart-product-img"
                />
                <span>{item.name}</span>
                {/* Trash icon below image & name */}
                <button
                  className="cart-remove-btn-inline"
                  onClick={() => handleRemove(index)}
                >
                  <FiTrash2 />
                </button>
              </td>

              <td data-label="Price" className="cart-price-cell">
                RS: {item.price}
              </td>

              <td data-label="Quantity" className="cart-quantity-cell">
                <div className="cart-quantity-btns">
                  <button onClick={() => handleDecrease(index)}>-</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => handleIncrease(index)}>+</button>
                </div>
              </td>
              <td data-label="Total" className="cart-total-cell">
                RS: {(item.price || 0) * (item.quantity || 1)}
              </td>
              <td data-label="Remove" className="cart-remove-cell">
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-subtotal">
        <h3>Subtotal: RS: {subtotal}</h3>
        <button className="check-btn" onClick={handleCheckout}>
          Check Out
        </button>
      </div>
    </div>
  );
}
