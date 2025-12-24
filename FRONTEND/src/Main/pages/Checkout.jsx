import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import "./checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [billing, setBilling] = useState({
    email: "",
    country: "Pakistan",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postal: "",
    phone: "",
    payment: "cod",
  });
  const [card, setCard] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  // Load cart from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!billing.email.trim()) newErrors.email = "Email is required";
    if (!billing.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!billing.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!billing.address.trim()) newErrors.address = "Address is required";
    if (!billing.city.trim()) newErrors.city = "City is required";
    if (!billing.phone.trim()) newErrors.phone = "Phone number is required";
    if (billing.payment === "card") {
      if (!card.nameOnCard.trim())
        newErrors.nameOnCard = "Name on card is required";
      if (!card.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      if (!card.expiry.trim()) newErrors.expiry = "Expiry date is required";
      if (!card.cvv.trim()) newErrors.cvv = "CVV is required";
    }
    if (cartItems.length === 0) newErrors.cart = "Your cart is empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handlePlaceOrder = async () => {
  if (!validateForm()) return;

  const orderData = {
    customer: billing.firstName + " " + billing.lastName,
    email: billing.email,
    phone: billing.phone,
    address: billing.address,
    city: billing.city,
    paymentMethod: billing.payment,
    products: cartItems.map((item) => ({
      product: item._id,
      qty: item.quantity || 1,
      size: item.selectedSize || item.size || "",
      price: item.price,
      name: item.name
    })),
    totalAmount: total,
    status: "Pending",
    date: new Date().toLocaleString(),
  };

  try {
    const res = await fetch("https://nishat-api.vercel.app/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) throw new Error("Failed to place order");

    const data = await res.json();
    console.log("ORDER DATA:", data);

    alert(
      billing.payment === "card"
        ? "Payment successful! "
        : "Order placed successfully! "
    );

    localStorage.removeItem("cart");

    //  Send order to thank-you page
    navigate("/thank-you", { state: { order: data } });

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again!");
  }
};

  const buttonLabel = billing.payment === "card" ? "Pay Now" : "Complete Order";

  return (
    <>
      {/* HEADER */}
      <header className="ck-header">
        <div className="ck-header-inner">
          <div className="ck-logo" onClick={() => navigate("/")}>
            NISHAT
          </div>
          <button
            className="ck-cart-icon-btn"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart className="ck-cart-icon" />
            <span className="ck-cart-count">
              {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
            </span>
          </button>
        </div>
      </header>

      <div className="ck-container">
        {/* LEFT: Billing & Payment */}
        <div className="ck-left ck-form">
          {/* Contact & Delivery Fields */}
          <div className="ck-section">
            <h2 className="ck-section-title">Contact</h2>
            <input
              className="ck-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={billing.email}
              onChange={handleBillingChange}
            />
            {errors.email && <p className="ck-error-text">{errors.email}</p>}
          </div>

          <div className="ck-section">
            <h2 className="ck-section-title">Delivery</h2>
            <input
              className="ck-input"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={billing.firstName}
              onChange={handleBillingChange}
            />
            {errors.firstName && (
              <p className="ck-error-text">{errors.firstName}</p>
            )}
            <input
              className="ck-input"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={billing.lastName}
              onChange={handleBillingChange}
            />
            {errors.lastName && (
              <p className="ck-error-text">{errors.lastName}</p>
            )}
            <input
              className="ck-input"
              type="text"
              name="address"
              placeholder="Address"
              value={billing.address}
              onChange={handleBillingChange}
            />
            {errors.address && (
              <p className="ck-error-text">{errors.address}</p>
            )}
            <input
              className="ck-input"
              type="text"
              name="city"
              placeholder="City"
              value={billing.city}
              onChange={handleBillingChange}
            />
            {errors.city && <p className="ck-error-text">{errors.city}</p>}
            <input
              className="ck-input"
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={billing.phone}
              onChange={handleBillingChange}
            />
            {errors.phone && <p className="ck-error-text">{errors.phone}</p>}
          </div>

          {/* Payment */}
          <div className="ck-section">
            <h2 className="ck-section-title">Payment</h2>
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={billing.payment === "cod"}
                onChange={handleBillingChange}
              />{" "}
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={billing.payment === "card"}
                onChange={handleBillingChange}
              />{" "}
              Credit / Debit Card
            </label>

            {billing.payment === "card" && (
              <>
                <input
                  className="card-input"
                  type="text"
                  name="nameOnCard"
                  placeholder="Name on Card"
                  value={card.nameOnCard}
                  onChange={handleCardChange}
                />
                <input
                  className="card-input"
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={card.cardNumber}
                  onChange={handleCardChange}
                />
                <input
                  className="card-input"
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={handleCardChange}
                />
                <input
                  className="card-input"
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={handleCardChange}
                />
              </>
            )}

            <button className="ck-btn" onClick={handlePlaceOrder}>
              {buttonLabel}
            </button>

            {/* Footer under button */}
            <div className="ck-footer">
              <div className="ck-footer-line" />
              <div className="ck-footer-links">
                <button type="button">Shipping Policy</button>
                <span>•</span>
                <button type="button">Privacy Policy</button>
                <span>•</span>
                <button type="button">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="ck-right">
          <h2 className="ck-section-title">Order Summary</h2>
          {errors.cart && <p className="ck-error-text">{errors.cart}</p>}
          {cartItems.map((item, i) => (
            <div className="ck-summary-card" key={i}>
              <img
                className="ck-summary-img"
                src={
                  item.images && item.images.length > 0
                    ? `https://nishat-api.vercel.app${item.images[0]}`
                    : "https://via.placeholder.com/80"
                }
                alt={item.name}
              />

              <div>{item.name}</div>
              <div className="ck-price">RS {(item.price || 0) * (item.quantity || 1)}</div>
            </div>
          ))}
         <div className="ck-total-box">
  <div className="ck-total-row">
    <span>Subtotal</span>
    <span>RS {subtotal.toLocaleString()}</span>
  </div>
  <div className="ck-total-row">
    <span>Shipping</span>
    <span>{shipping === 0 ? "FREE" : `RS ${shipping.toLocaleString()}`}</span>
  </div>
  <div className="ck-total-row ck-total-final">
    <span>Total</span>
    <span>RS {total.toLocaleString()}</span>
  </div>
</div>

        </div>
      </div>
    </>
  );
}
