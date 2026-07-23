import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contactApi } from "../services/api";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactApi.getAll();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await contactApi.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete message");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">View Users</h1>
        </div>

        {loading && <p className="text-gray-500 text-sm">Loading messages…</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && messages.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No contact submissions yet.
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-gray-900">{msg.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-2">
                <p>
                  <span className="font-medium text-gray-700">WhatsApp: </span>
                  <a
                    href={`https://wa.me/${msg.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2E8B57] hover:underline"
                  >
                    {msg.whatsapp_number}
                  </a>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Email: </span>
                  <a href={`mailto:${msg.email}`} className="text-[#2E8B57] hover:underline">
                    {msg.email}
                  </a>
                </p>
              </div>
              <p className="text-sm text-gray-800 border-t border-gray-100 pt-2 whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
