import { useCart } from "../context/CartContext";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, itemSize, currentQuantity, change) => {
  const newQuantity = currentQuantity + change;
  if (newQuantity >= 1) {
    updateQuantity(itemId, itemSize, newQuantity);
  }
};



const handleRemoveItem = (itemId, itemSize) => {
  removeFromCart(itemId, itemSize);
};


  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#2E8B57] hover:bg-[#C1440E] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="border-t border-gray-200 p-4">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="flex items-center space-x-4 md:col-span-5 w-full">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        {item.grade && (
                          <p className="text-sm text-gray-500">Grade: {item.grade}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="md:col-span-2 text-center">
                      <span className="font-medium text-gray-800">₹{item.price}</span>
                    </div>
                    
                    {/* Quantity */}
                    <div className="md:col-span-3">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity, -1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity, 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="md:col-span-1 text-center">
                      <span className="font-semibold text-[#2E8B57]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    
                    {/* Remove Button */}
                    <div className="md:col-span-1 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-[#2E8B57]">₹{cartTotal}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-[#2E8B57] hover:bg-[#C1440E] text-white py-3 rounded-full font-semibold mt-6 transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate("/products")}
                className="w-full text-[#2E8B57] hover:text-[#C1440E] text-center py-2 mt-3 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;