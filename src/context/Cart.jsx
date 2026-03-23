import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-[#2E8B57] mb-6">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#2E8B57] text-white px-6 py-2 rounded-lg hover:bg-[#1a6b3a]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div> 
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => navigate("/products")}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-[#C1440E] text-white px-6 py-2 rounded-lg hover:bg-[#9a360b]"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
