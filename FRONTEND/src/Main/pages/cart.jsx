import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleCheckout = () => navigate("/checkout");

  const handleIncrease = (index) => {
    const item = cartItems[index];
    updateQuantity(item._id, (Number(item.quantity) || 1) + 1);
  };

  const handleDecrease = (index) => {
    const item = cartItems[index];
    updateQuantity(item._id, Math.max((Number(item.quantity) || 1) - 1, 1));
  };

  const handleRemove = (index) => {
    const item = cartItems[index];
    removeFromCart(item._id);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  if (cartItems.length === 0)
    return <h2 className="empty-cart">Your cart is empty.</h2>;

  return (
    <div className="cart-page">
      <div className="heading">
        <h2>Shopping Cart</h2>
      </div>

      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item._id || index}>
                <td data-label="Product" className="cart-product-cell">
                  <img
                    src={
                      item.images?.length
                        ? `https://nishat-api.vercel.app${item.images[0]}`
                        : "https://placehold.co/80x120?text=No+Image"
                    }
                    alt={item.name}
                    className="cart-product-img"
                  />

                  <div className="cart-product-info">
                    <span className="cart-product-name">{item.name}</span>
                    {item.size && (
                      <span className="cart-product-size">Size: {item.size}</span>
                    )}

                    <button
                      className="cart-remove-btn-inline"
                      onClick={() => handleRemove(index)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>

                <td data-label="Price">RS: {item.price}</td>

                <td data-label="Quantity">
                  <div className="cart-quantity-btns">
                    <button onClick={() => handleDecrease(index)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(index)}>+</button>
                  </div>
                </td>

                <td data-label="Total">
                  RS: {Number(item.price) * Number(item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-subtotal">
        <h3>Subtotal: RS: {subtotal}</h3>
        <button className="check-btn" onClick={handleCheckout}>
          Check Out
        </button>
      </div>
    </div>
  );
}
