import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = null) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && item.size === size
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: (Number(item.quantity) || 0) + Number(quantity) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: Number(quantity) || 1,
            size: size || null,
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
        item._id === _id ? { ...item, quantity: Math.max(1, Number(newQty)) } : item
      )
    );

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
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
