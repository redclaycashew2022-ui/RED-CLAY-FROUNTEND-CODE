import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Validate required fields
    if (!item.id || !item.name || typeof item.price !== "number") {
      console.error("Invalid cart item:", item);
      return;
    }

    // Normalize the item structure
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

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        cartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
