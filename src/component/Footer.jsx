import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaShippingFast,
  FaWhatsapp,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2E8B57] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-white/20 pb-2">
              Red Clay Cashews
            </h3>
            <p className="mb-4">
              Premium cashews grown in the mineral-rich red soils of Panruti,
              Tamil Nadu. Handpicked and traditionally processed for the best
              quality and flavor.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/RedClayCashews"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C1440E] transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/redclay_2022"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C1440E] transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://chat.whatsapp.com/FAeonuhvWfE0fvxn3tI643"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C1440E] transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-white/20 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `hover:text-[#C1440E] transition-colors ${
                      isActive ? "text-[#C1440E]" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `hover:text-[#C1440E] transition-colors ${
                      isActive ? "text-[#C1440E]" : ""
                    }`
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `hover:text-[#C1440E] transition-colors ${
                      isActive ? "text-[#C1440E]" : ""
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `hover:text-[#C1440E] transition-colors ${
                      isActive ? "text-[#C1440E]" : ""
                    }`
                  }
                >
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `hover:text-[#C1440E] transition-colors ${
                      isActive ? "text-[#C1440E]" : ""
                    }`
                  }
                >
                  Your Cart
                </NavLink>
              </li>
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-white/20 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 flex-shrink-0" />
                <span>
                  Panruti, Cuddalore District
                  <br />
                  Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-[#C1440E] transition-colors"
                >
                  +91 9080605735
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <a
                  href="mailto:info@redclaycashews.com"
                  className="hover:text-[#C1440E] transition-colors"
                >
                  redclaycashews2022@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <FaShippingFast className="mr-2" />
                <span>All India Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Red Clay Cashews. All Rights
            Reserved.
          </div>
          <div className="flex space-x-4">
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `text-sm hover:text-[#C1440E] transition-colors ${
                  isActive ? "text-[#C1440E]" : ""
                }`
              }
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                `text-sm hover:text-[#C1440E] transition-colors ${
                  isActive ? "text-[#C1440E]" : ""
                }`
              }
            >
              Terms of Service
            </NavLink>
            <NavLink
              to="/shipping"
              className={({ isActive }) =>
                `text-sm hover:text-[#C1440E] transition-colors ${
                  isActive ? "text-[#C1440E]" : ""
                }`
              }
            >
              Shipping Policy
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
