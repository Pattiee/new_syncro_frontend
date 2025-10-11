import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Pen, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "../../../components/Loader";

export const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (!user && !loading) navigate("/", { replace: true });
    if (user) {
      setFormData({
        givenName: user?.givenName || "",
        familyName: user?.familyName || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
      });
    }
  }, [loading, navigate, user]);

  if (loading) return <Loader />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    // TODO: PATCH/PUT to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      givenName: user?.givenName || "",
      familyName: user?.familyName || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-orange-400 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-6xl text-white ring-2 ring-orange-400 shadow-md">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4 text-gray-800 dark:text-gray-100 w-full">
        <h2 className="text-2xl font-semibold">
          {user?.givenName || "Given name"} {user?.familyName || "Family name"}
        </h2>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail size={18} />
          <span>{user?.username}</span>
          {user?.emailVerified ? (
            <span className="flex items-center text-green-500 text-sm gap-1">
              <CheckCircle size={16} /> Verified
            </span>
          ) : (
            <span className="flex items-center text-red-500 text-sm gap-1">
              <XCircle size={16} /> Unverified
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-sm">
          <Phone size={18} />
          <span>{user?.phone || "Unavailable"}</span>
        </div>

        {/* Bio */}
        <div className="mt-3">
          <span className="font-medium">Bio:</span>{" "}
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {user?.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Floating Circular Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-orange-500 text-white rounded-full shadow-lg px-4 py-3 group transition-all hover:pr-6 hover:bg-orange-600"
      >
        <Pen size={20} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Edit Profile
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Edit Profile
              </h3>

              <div className="space-y-3">
                <input
                  name="givenName"
                  value={formData.givenName}
                  onChange={handleChange}
                  placeholder="Given name"
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700"
                />
                <input
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleChange}
                  placeholder="Family name"
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Short bio"
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
