import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            qty: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (_id) =>
    setCartItems((prev) => prev.filter((item) => item._id !== _id));

  const updateQuantity = (_id, newQty) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, qty: Math.max(1, Number(newQty)) } : item
      )
    );

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((total, item) => total + (item.qty || 1), 0);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
