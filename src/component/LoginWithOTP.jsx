import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const LoginWithOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { requestOTP, verifyOTP, isAuthenticated, user } = useAuth();

 useEffect(() => {
  if (isAuthenticated) {
    const returnUrl = location.state?.from;
    const directBuyItem = location.state?.directBuyItem;

    if (user?.user_type === "admin") {
      navigate("/admin/dashboard");
    } else {
      if (returnUrl === "/checkout") {
        navigate("/checkout", {
          state: { directBuyItem },
        });
      } else if (returnUrl) {
        navigate(returnUrl);
      } else {
        navigate("/"); // default home
      }
    }
  }
}, [isAuthenticated, user]);
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && showOtpField) {
      handleOtpSubmit();
    }
  }, [otp]);

  // OTP timer countdown
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      // Use AuthContext requestOTP so behavior is consistent across the app
      const {
        success,
        isAdmin,
        message: msg,
        data,
      } = await requestOTP(formattedPhone);

      if (success) {
        setShowOtpField(true);
        setOtpTimer(300); // 300 seconds (5 minutes) timer
        setMessage({
          text: `OTP sent to ${formattedPhone}. Please verify.`,
          type: "success",
        });

        // AuthContext already marks admin phones if applicable, but store fallback
        if (data?.user_type) {
          localStorage.setItem("userType", data.user_type);
        }
      } else {
        setMessage({ text: msg || "Failed to send OTP", type: "error" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);

      let errorMessage = "Error sending OTP";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      // Use AuthContext verifyOTP to set app-wide auth state
      const result = await verifyOTP(formattedPhone, otp);

      if (result.success) {
        setIsVerified(true);
        const userData = result.user;
        setUserData(userData);

        setMessage({
          text: `Phone number verified successfully! Welcome ${
            userData.user_type === "admin" ? "Admin" : "User"
          }!`,
          type: "success",
        });

        // Redirect based on user type immediately
        if (userData.user_type === "admin") {
          navigate("/admin/dashboard");
        } else {
          const returnUrl = location.state?.from;
          const directBuyItem = location.state?.directBuyItem;
          if (userData.user_type === "admin") {
  navigate("/admin/dashboard");
} else {
  if (returnUrl === "/checkout") {
    navigate("/checkout", {
      state: { directBuyItem },
    });
  } else if (
    returnUrl &&
    !returnUrl.includes("/login") &&
    !returnUrl.includes("/admin")
  ) {
    navigate(returnUrl);
  } else {
    navigate("/");
  }
}
        }
      } else {
        setMessage({ text: result.message || "Invalid OTP", type: "error" });
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      // Enhanced error handling
      let errorMessage = "Verification failed";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if number is admin
  const isAdminNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    const last10 = cleanNumber.slice(-10);
    const adminNumbers = ["8754201900"]; // Add more admin numbers if needed (10-digit format)
    return adminNumbers.includes(last10);
  };

  const resendOtp = () => {
    setOtp("");
    setOtpTimer(300);
    handleSubmit();
  };

  const resetForm = () => {
    setPhoneNumber("");
    setOtp("");
    setShowOtpField(false);
    setIsVerified(false);
    setMessage({ text: "", type: "" });
    setOtpTimer(0);
    setUserData(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 overflow-hidden"
      >
        {/* Header */}
        <motion.div className="text-center mb-8">
          <motion.h2 className="text-3xl font-bold text-gray-900 mb-2">
            Login with OTP
          </motion.h2>
          <motion.p className="text-gray-600">
            Enter your phone number to receive OTP
          </motion.p>
          {isAdminNumber(phoneNumber) && showOtpField && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-600 font-medium mt-2"
            >
              Admin account detected
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key={showOtpField ? "otp-form" : "login-form"}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {!showOtpField ? (
                <motion.form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all duration-300">
                      <div className="flex items-center px-3 py-2 bg-gray-100 border-r border-gray-300">
                        <img
                          src="https://flagcdn.com/w40/in.png"
                          alt="India"
                          className="w-6 h-4 mr-2"
                        />
                        <span className="text-gray-700 font-medium">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setPhoneNumber(value);
                        }}
                        placeholder="Enter your phone number"
                        required
                        className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                        pattern="[0-9]{10}"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length !== 10}
                    className={`w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${
                      isLoading || phoneNumber.length !== 10
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.svg
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </motion.svg>
                        Sending OTP...
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Enter OTP sent to +91{phoneNumber}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6-digit OTP"
                      required
                      pattern="\d{6}"
                      maxLength="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest transition-all duration-300"
                    />

                    {otpTimer > 0 && (
                      <p className="text-sm text-gray-500 text-center">
                        OTP expires in{" "}
                        {`${Math.floor(otpTimer / 60)}:${(otpTimer % 60)
                          .toString()
                          .padStart(2, "0")}`}{" "}
                        minutes
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className={`flex-1 py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${
                        isLoading || otp.length !== 6
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>

                    {otpTimer === 0 && (
                      <button
                        type="button"
                        onClick={resendOtp}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpField(false);
                      setOtp("");
                      setMessage({ text: "", type: "" });
                    }}
                    className="w-full text-center text-gray-600 hover:text-gray-700 text-sm transition-colors duration-300"
                  >
                    ← Change Phone Number
                  </button>
                </motion.form>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome {userData?.user_type === "admin" ? "Admin" : "User"}!
              </h3>
              <p className="text-gray-600 mb-6">
                {userData?.user_type === "admin"
                  ? "You have successfully logged in as Administrator"
                  : "You have successfully logged in"}
              </p>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                Login Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LoginWithOTP;
