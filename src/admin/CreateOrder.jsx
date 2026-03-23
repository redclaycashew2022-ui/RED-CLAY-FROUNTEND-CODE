import React from "react";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const navigate = useNavigate();
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Create Order</h1>
      </div>
      <p className="text-gray-600">
        This is the order creation section. Implement order form and logic here.
      </p>
    </div>
  );
};

export default CreateOrder;
