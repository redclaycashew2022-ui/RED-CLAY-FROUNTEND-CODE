import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // ✅ Load from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add to Cart
  const addToCart = (item) => {
    if (!item.id || !item.name || typeof item.price !== "number") {
      console.error("Invalid cart item:", item);
      return;
    }

    const normalizedItem = {
      id: item.id,
      name: item.name,
      image: item.image || "/placeholder-image.jpg",
      price: item.price,
      size: typeof item.size === "string" ? item.size : "N/A",
      quantity: Number.isInteger(item.quantity) ? item.quantity : 1,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === normalizedItem.id && i.size === normalizedItem.size
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === normalizedItem.id && i.size === normalizedItem.size
            ? { ...i, quantity: i.quantity + normalizedItem.quantity }
            : i
        );
      }

      return [...prevItems, normalizedItem];
    });
  };

 const removeFromCart = (id, size) => {
  setCartItems((prev) => 
    prev.filter((item) => !(item.id === id && item.size === size))
  );
};

  const updateQuantity = (id, size, newQuantity) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    )
  );
};

  // ✅ Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Cart Count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Cart Total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);