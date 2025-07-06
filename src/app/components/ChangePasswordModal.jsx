import React, { useState } from "react";
import axiosInstance from "../../utils/axios";

function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      await axiosInstance.post("/api/change_password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      onClose();
      alert("Password changed successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="password"
          placeholder="Old Password"
          className="w-full p-2 border rounded mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-2 border rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
       <div className="flex gap-5">
       <button
          onClick={handleChangePassword}
          className="w-full p-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
        <button
          onClick={onClose}
          className=" w-full p-2 bg-red-600 text-white rounded shadow-md hover:bg-red-700"
        >
          Cancel
        </button>
       </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
