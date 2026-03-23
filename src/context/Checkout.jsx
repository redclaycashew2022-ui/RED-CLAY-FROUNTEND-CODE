import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const variants = {
  hidden: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
  exit: { opacity: 0, x: -20, transition: { type: "tween", duration: 0.2 } },
};

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const location = useLocation();
const directBuyItem = location.state?.directBuyItem;
const product = location.state?.product;
  const navigate = useNavigate();
  const finalItems = directBuyItem ? [directBuyItem] : cartItems;
  const [showAddressForm, setShowAddressForm] = useState(false);
const [savedAddressId, setSavedAddressId] = useState(null);

  const [step, setStep] = useState("delivery");
 const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  country: "India",
});
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Calculations based on the cartItems (which should already have API data from ProductDetails)
  const subtotal = finalItems.reduce((sum, item) => 
  sum + Number(item.price) * item.quantity, 0
);
  const shippingCost =0;
  const estimatedTax = subtotal * 0.18;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppOrder = () => {
   const itemsText = finalItems
  .map((item) => `${item.name} (${item.size}) - ${item.quantity} x ₹${item.price}`)
  .join("%0A");
    const totalText = `Total: ₹${grandTotal.toFixed(2)}`;
    const customerInfo = `Customer: ${formData.firstName} ${formData.lastName}%0APhone: ${formData.phone}%0AAddress: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
    const message = `New Order Request:%0A%0A${itemsText}%0A%0A${totalText}%0A%0A${customerInfo}`;
    window.open(`https://wa.me/918754201900?text=${message}`, "_blank");
    clearCart();
    navigate("/order-confirmation", { state: { paymentMethod: "whatsapp" } });
  };

 const handleBackToStore = () => {
  // If product exists → go to ProductDetails
  if (product) {
    navigate("/productdetails", { state: { product } });
  } else {
    // fallback (cart flow or refresh case)
    navigate("/");
  }
};

const handleSaveAddress = async () => {
  try {
    const response = await fetch("https://red-clay-backend.onrender.com/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    if (data.success) {
      alert("Address saved successfully!");
      setShowAddressForm(false);
      setSavedAddressId(data.data.id);
    } else {
      alert("Failed to save address");
    }
  } catch (err) {
    console.error("API ERROR:", err);
    alert("Error saving address");
  }
};

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP HEADER */}
        <div className=" items-center mb-8  p-4 ">
          
         <button 
  onClick={handleBackToStore}
  className="text-[#2E8B57] hover:underline font-medium"
>
  ← Back to Store
</button>
        </div>

<div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="w-full lg:w-7/12 order-1 lg:order-1">
           {/* RIGHT SIDE: DELIVERY & PAYMENT FORMS */}
          <div className="w-full lg:w-22/12 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {step === "delivery" ? (
                <motion.div
                  key="delivery" initial="hidden" animate="enter" exit="exit" variants={variants}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                >
                  {!showAddressForm && (
  <button
    onClick={() => setShowAddressForm(true)}
    className="mb-4 px-4 py-2 bg-[#2E8B57] text-white rounded-xl hover:bg-[#246645]"
  >
    + Add Address
  </button>
)}{showAddressForm && (
  <div className="space-y-4 mb-6">

    {/* First Name & Last Name */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative">
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder=" "
          className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
        />
        <label className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
          First Name
        </label>
      </div>

      <div className="relative">
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder=" "
          className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
        />
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
          Last Name
        </label>
      </div>
    </div>

    {/* Phone */}
    <div className="relative">
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder=" "
        className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
      />
      <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
        Phone Number
      </label>
    </div>

    {/* Address */}
    <div className="relative">
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder=" "
        className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
      />
      <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
        Address
      </label>
    </div>

    {/* Apartment */}
    <div className="relative">
      <input
        name="apartment"
        value={formData.apartment}
        onChange={handleChange}
        placeholder=" "
        className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
      />
      <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
        Apartment / Suite / etc.
      </label>
    </div>

    {/* City, State, Pincode */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="relative">
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder=" "
          className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
        />
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
          City
        </label>
      </div>

      <div className="relative">
        <input
          list="states"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder=" "
          className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
        />
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
          State
        </label>
        <datalist id="states">
          {indianStates.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="relative">
        <input
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder=" "
          className="peer p-5 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
        />
        <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
          PIN Code
        </label>
      </div>
    </div>

    {/* Country */}
    <div className="relative">
      <input
        name="country"
        value="India"
        readOnly
        placeholder=" "
        className="peer p-5 border border-gray-200 rounded-xl w-full bg-gray-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
      />
      <label className="absolute left-3 top-1 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
        Country
      </label>
    </div>

    <button
      onClick={handleSaveAddress}
      className="mt-4 w-full bg-[#C1440E] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a3390c]"
    >
      Save Address
    </button>
  </div>
)}   
               

                 
                 

                 
                </motion.div>
              ) : (
                <motion.div
                  key="payment" initial="hidden" animate="enter" exit="exit" variants={variants}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                >
                  <h2 className="text-2xl font-bold text-[#2E8B57] mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div 
                      onClick={() => setPaymentMethod("online")}
                      className={`p-5 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'online' ? 'border-[#2E8B57] bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">Online Payment</p>
                        <p className="text-xs text-gray-500">UPI, Cards, Netbanking</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#2E8B57]' : 'border-gray-300'}`}>
                        {paymentMethod === 'online' && <div className="w-3 h-3 bg-[#2E8B57] rounded-full" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("whatsapp")}
                      className={`p-5 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'whatsapp' ? 'border-[#25D366] bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">WhatsApp Order</p>
                        <p className="text-xs text-gray-500">Pay after WhatsApp confirmation</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'whatsapp' ? 'border-[#25D366]' : 'border-gray-300'}`}>
                        {paymentMethod === 'whatsapp' && <div className="w-3 h-3 bg-[#25D366] rounded-full" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep("delivery")} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-500">Back</button>
                    {paymentMethod === "whatsapp" ? (
                      <button onClick={handleWhatsAppOrder} className="flex-[2] bg-[#25D366] text-white py-4 rounded-xl font-bold shadow-lg">Place WhatsApp Order</button>
                    ) : (
                      <button 
                        disabled={!paymentMethod}
                        className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-lg transition-all ${!paymentMethod ? 'bg-gray-300' : 'bg-[#2E8B57] hover:bg-[#216d44]'}`}
                        onClick={() => { clearCart(); navigate("/order-confirmation"); }}
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          </div>
          <div className="w-full lg:w-5/12 order-2 lg:order-2 lg:sticky lg:top-8">
          
                 {/* LEFT SIDE: ORDER SUMMARY (Product Details from API via Cart) */}
          <div className="w-full lg:w-10/14 order-2 lg:order-1 lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {finalItems.length > 0 ? (
                finalItems.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-2">
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                        <span className="absolute -top-2 -right-2 bg-[#2E8B57] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Size: <span className="text-gray-700 font-medium">{item.size}</span></p>
                        <p className="text-sm font-semibold text-[#2E8B57] mt-1">₹{item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                )}
              </div>

              {/* Price Calculation Summary */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                <span className="font-medium text-green-600">
  Free
</span>
                </div>
                {/* <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium">₹{estimatedTax.toFixed(2)}</span>
                </div> */}
                <div className="flex justify-between text-xl font-extrabold text-gray-900 border-t pt-4 mt-4">
                  <span>Total</span>
                  <span className="text-[#C1440E]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          </div>
   

         
        </div>
      </div>
    </div>
  );
};

export default Checkout;