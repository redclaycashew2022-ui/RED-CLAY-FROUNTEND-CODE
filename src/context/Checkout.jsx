  import React, { useState, useEffect } from "react";
  import { useCart } from "../context/CartContext";
  import { useNavigate } from "react-router-dom";
  import { motion, AnimatePresence } from "framer-motion";
  import { useLocation } from "react-router-dom";
  import { API_BASE_URL } from "../services/api";

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  ];

  const emptyForm = {
    first_name: "", last_name: "", phone: "",
    address: "", apartment: "", city: "",
    state: "Tamil Nadu", pincode: "", country: "India",
  };

  const variants = {
    hidden: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
    exit:  { opacity: 0, x: -20, transition: { type: "tween", duration: 0.2 } },
  };

  
  // ── small reusable floating-label input ──────────────────────────────────────
  const Field = ({ label, name, value, onChange, readOnly, list }) => (
    <div className="relative">
      <input
        name={name} value={value} onChange={onChange}
        readOnly={readOnly} placeholder=" " list={list}
        className={`peer pt-6 pb-2 px-4 border border-gray-200 rounded-xl w-full text-sm
          focus:outline-none focus:ring-2 focus:ring-[#2E8B57] transition
          ${readOnly ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
      />
      <label className="absolute left-4 top-2 text-[11px] font-semibold text-gray-400
        transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
        peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[11px]
        peer-focus:font-semibold peer-focus:text-[#2E8B57]">
        {label}
      </label>
    </div>
  );

  // ── address form (add OR edit) ───────────────────────────────────────────────
  const AddressForm = ({ initial = emptyForm, onSave, onCancel, saving }) => {
    const [form, setForm] = useState(initial);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#f7fdf9] border border-[#2E8B57]/20 rounded-2xl p-5 space-y-4 mb-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name"  name="first_name" value={form.first_name} onChange={handleChange} />
          <Field label="Last Name"   name="last_name"  value={form.last_name}  onChange={handleChange} />
        </div>
        <Field label="Phone Number" name="phone"     value={form.phone}     onChange={handleChange} />
        <Field label="Address"      name="address"   value={form.address}   onChange={handleChange} />
        <Field label="Apartment / Suite" name="apartment" value={form.apartment} onChange={handleChange} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="City"    name="city"    value={form.city}    onChange={handleChange} />
          <Field label="State"   name="state"   value={form.state}   onChange={handleChange} list="states-list" />
          <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
        </div>
        <Field label="Country" name="country" value="India" readOnly />
        <datalist id="states-list">
          {indianStates.map((s) => <option key={s} value={s} />)}
        </datalist>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex-[2] py-3 bg-[#2E8B57] text-white rounded-xl text-sm font-bold hover:bg-[#246645] transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Address"}
          </button>
        </div>
      </motion.div>
    );
  };

  // ── main component ───────────────────────────────────────────────────────────
  const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const location = useLocation();
    const navigate  = useNavigate();

    const directBuyItem = location.state?.directBuyItem;
    const product       = location.state?.product;
    const finalItems    = directBuyItem ? [directBuyItem] : cartItems;

    // address state
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddForm,  setShowAddForm]  = useState(false);
    const [editAddress,  setEditAddress]  = useState(null); // address object being edited
    const [saving,       setSaving]       = useState(false);
    const [deletingId,   setDeletingId]   = useState(null);

    // payment / step
    const [step,           setStep]           = useState("delivery");
    const [paymentMethod,  setPaymentMethod]  = useState(null);

    // totals
    const subtotal   = finalItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const grandTotal = subtotal; // shipping free, tax commented out

    // ── fetch saved addresses on mount ────────────────────────────────────────
    useEffect(() => {
      const phone = localStorage.getItem("phoneNumber") || localStorage.getItem("phone");
      if (!phone) return;
      fetch(`${API_BASE_URL}/address/${phone}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSavedAddresses(data);
            if (data.length > 0) setSelectedAddressId(data[0].id);
          }
        })
        .catch((e) => console.error("Fetch addresses:", e));
    }, []);

    // ── re-fetch helper ────────────────────────────────────────────────────────
    const refetchAddresses = async (phone) => {
      const res  = await fetch(`${API_BASE_URL}/address/${phone}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedAddresses(data);
        if (data.length > 0 && !selectedAddressId) setSelectedAddressId(data[0].id);
      }
    };

    // ── save new address ───────────────────────────────────────────────────────
    const handleSaveNew = async (form) => {
      setSaving(true);
      try {
        const res  = await fetch(`${API_BASE_URL}/address`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem("phone", form.phone);
          const phone = localStorage.getItem("phoneNumber") || form.phone;
          await refetchAddresses(phone);
          setSelectedAddressId(data.data.id);
          setShowAddForm(false);
        } else {
          alert(data.message || "Failed to save address");
        }
      } catch (e) {
        alert("Error saving address");
      } finally {
        setSaving(false);
      }
    };

    // ── update existing address ────────────────────────────────────────────────
    const handleUpdateAddress = async (form) => {
      setSaving(true);
      try {
        const res  = await fetch(`${API_BASE_URL}/address/${editAddress.id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok && (data.success || data.data)) {
          const phone = localStorage.getItem("phoneNumber") || form.phone;
          await refetchAddresses(phone);
          setEditAddress(null);
        } else {
          // optimistic update if backend doesn't return proper shape
          setSavedAddresses((prev) =>
            prev.map((a) => (a.id === editAddress.id ? { ...a, ...form } : a))
          );
          setEditAddress(null);
        }
      } catch (e) {
        alert("Error updating address");
      } finally {
        setSaving(false);
      }
    };

    // ── delete address ─────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this address?")) return;
      setDeletingId(id);
      try {
        await fetch(`${API_BASE_URL}/address/${id}`, { method: "DELETE" });
        setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selectedAddressId === id) {
          const remaining = savedAddresses.filter((a) => a.id !== id);
          setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
        }
      } catch (e) {
        alert("Error deleting address");
      } finally {
        setDeletingId(null);
      }
    };

    // ── proceed to payment ─────────────────────────────────────────────────────
    const handleContinueToPayment = () => {
      if (!selectedAddressId) {
        alert("Please select or add a delivery address.");
        return;
      }
      setStep("payment");
    };

    // ── whatsapp order ─────────────────────────────────────────────────────────
    const handleWhatsAppOrder = () => {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      const itemsText = finalItems
        .map((i) => `${i.name} (${i.size}) - ${i.quantity} x ₹${i.price}`)
        .join("%0A");
      const totalText = `Total: ₹${grandTotal.toFixed(2)}`;
      const addrText  = addr
        ? `Customer: ${addr.first_name} ${addr.last_name}%0APhone: ${addr.phone}%0AAddress: ${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`
        : "";
      const msg = `New Order Request:%0A%0A${itemsText}%0A%0A${totalText}%0A%0A${addrText}`;
      window.open(`https://wa.me/918754201900?text=${msg}`, "_blank");
      clearCart();
      navigate("/order-confirmation", { state: { paymentMethod: "whatsapp" } });
    };

    const handleBackToStore = () => {
      product ? navigate("/productdetails", { state: { product } }) : navigate("/");
    };

    // ── selected address object ────────────────────────────────────────────────
    const selectedAddr = savedAddresses.find((a) => a.id === selectedAddressId);

    // ─────────────────────────────────────────────────────────────────────────
    return (
      <div className="min-h-screen bg-[#FAF9F6] py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* header */}
          <div className="mb-8 p-2">
            <button onClick={handleBackToStore} className="text-[#2E8B57] hover:underline font-medium text-sm">
              ← Back to Store
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── LEFT: DELIVERY / PAYMENT ──────────────────────────────────── */}
            <div className="w-full lg:w-7/12">
              <AnimatePresence mode="wait">

                {/* ── DELIVERY STEP ────────────────────────────────────────── */}
                {step === "delivery" && (
                  <motion.div key="delivery" initial="hidden" animate="enter" exit="exit" variants={variants}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                  >
                    <h2 className="text-xl font-bold text-[#2E8B57] mb-5">Delivery Address</h2>

                    {/* saved address cards */}
                    <div className="space-y-3 mb-4">
                      {savedAddresses.map((addr) => (
                        <div key={addr.id}>
                          {/* edit form inline */}
                          {editAddress?.id === addr.id ? (
                            <AddressForm
                              initial={editAddress}
                              onSave={handleUpdateAddress}
                              onCancel={() => setEditAddress(null)}
                              saving={saving}
                            />
                          ) : (
                            <motion.div
                              layout
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all
                                ${selectedAddressId === addr.id
                                  ? "border-[#2E8B57] bg-[#f0faf4]"
                                  : "border-gray-100 hover:border-gray-300 bg-white"
                                }`}
                            >
                              {/* radio dot */}
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                                  ${selectedAddressId === addr.id ? "border-[#2E8B57]" : "border-gray-300"}`}>
                                  {selectedAddressId === addr.id && (
                                    <div className="w-2.5 h-2.5 bg-[#2E8B57] rounded-full" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-800 text-sm">
                                    {addr.first_name} {addr.last_name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    {addr.address}{addr.apartment ? `, ${addr.apartment}` : ""},{" "}
                                    {addr.city}, {addr.state} — {addr.pincode}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                                </div>

                                {/* edit / delete buttons */}
                                <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => { setShowAddForm(false); setEditAddress(addr); }}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#2E8B57] hover:bg-green-50 transition"
                                    title="Edit"
                                  >
                                    {/* pencil icon */}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536M9 13l6.364-6.364a2 2 0 012.828 0l.707.707a2 2 0 010 2.828L12.535 16H9v-3z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(addr.id)}
                                    disabled={deletingId === addr.id}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                                    title="Delete"
                                  >
                                    {/* trash icon */}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* selected badge */}
                              {selectedAddressId === addr.id && (
                                <span className="absolute top-2 right-10 text-[10px] font-bold text-[#2E8B57] bg-green-100 px-2 py-0.5 rounded-full">
                                  Selected
                                </span>
                              )}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* add new address form */}
                    {showAddForm && (
                      <AddressForm
                        onSave={handleSaveNew}
                        onCancel={() => setShowAddForm(false)}
                        saving={saving}
                      />
                    )}

                    {/* add address button */}
                    {!showAddForm && !editAddress && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-3 border-2 border-dashed border-[#2E8B57]/40 rounded-2xl
                          text-sm font-semibold text-[#2E8B57] hover:border-[#2E8B57] hover:bg-[#f0faf4] transition mb-6"
                      >
                        + Add New Address
                      </button>
                    )}

                    {/* continue button */}
                    <button
                      onClick={handleContinueToPayment}
                      disabled={!selectedAddressId}
                      className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-sm
                        ${selectedAddressId
                          ? "bg-[#2E8B57] text-white hover:bg-[#246645] shadow-[#2E8B57]/20"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Continue to Payment →
                    </button>
                  </motion.div>
                )}

                {/* ── PAYMENT STEP ─────────────────────────────────────────── */}
                {step === "payment" && (
                  <motion.div key="payment" initial="hidden" animate="enter" exit="exit" variants={variants}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                  >
                    <h2 className="text-xl font-bold text-[#2E8B57] mb-2">Payment Method</h2>

                    {/* selected address summary */}
                    {selectedAddr && (
                      <div className="mb-6 p-3 bg-[#f0faf4] border border-[#2E8B57]/20 rounded-xl text-xs text-gray-600">
                        <span className="font-bold text-gray-800">Delivering to: </span>
                        {selectedAddr.first_name} {selectedAddr.last_name},{" "}
                        {selectedAddr.address}, {selectedAddr.city} — {selectedAddr.pincode}
                        <button
                          onClick={() => setStep("delivery")}
                          className="ml-2 text-[#2E8B57] underline font-semibold"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <div className="space-y-3 mb-8">
                      {[
                        { id: "online",   label: "Online Payment",  sub: "UPI, Cards, Netbanking", color: "#2E8B57" },
                        { id: "whatsapp", label: "WhatsApp Order",   sub: "Pay after confirmation", color: "#25D366" },
                      ].map(({ id, label, sub, color }) => (
                        <div
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          className={`p-5 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all
                            ${paymentMethod === id ? `border-[${color}] bg-green-50` : "border-gray-100 hover:border-gray-300"}`}
                          style={paymentMethod === id ? { borderColor: color } : {}}
                        >
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{label}</p>
                            <p className="text-xs text-gray-500">{sub}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                            style={{ borderColor: paymentMethod === id ? color : "#d1d5db" }}>
                            {paymentMethod === id && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep("delivery")}
                        className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition"
                      >
                        ← Back
                      </button>

                      {paymentMethod === "whatsapp" ? (
                        <button
                          onClick={handleWhatsAppOrder}
                          className="flex-[2] bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:bg-[#1fba56] transition"
                        >
                          📲 Place WhatsApp Order
                        </button>
                      ) : (
                        <button
                          disabled={!paymentMethod}
                          onClick={() => { clearCart(); navigate("/order-confirmation"); }}
                          className={`flex-[2] py-4 rounded-xl font-bold text-sm shadow-lg transition-all
                            ${paymentMethod
                              ? "bg-[#C1440E] text-white hover:bg-[#a3390c]"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          ✓ Confirm Order
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: ORDER SUMMARY ──────────────────────────────────────── */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-800 mb-5 border-b pb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-[360px] overflow-y-auto pr-1">
                  {finalItems.length > 0 ? finalItems.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-1.5">
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                        <span className="absolute -top-2 -right-2 bg-[#2E8B57] text-white text-[10px] font-bold
                          w-5 h-5 flex items-center justify-center rounded-full shadow">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Size: <span className="text-gray-700 font-medium">{item.size}</span></p>
                        <p className="text-xs font-semibold text-[#2E8B57] mt-0.5">₹{item.price}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </motion.div>
                  )) : (
                    <p className="text-gray-400 text-center py-6 text-sm">Your cart is empty</p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-700">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#2E8B57]">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t pt-3 mt-2">
                    <span>Total</span>
                    <span className="text-[#C1440E]">₹{grandTotal.toFixed(2)}</span>
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