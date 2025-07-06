"use client";

import { useState } from "react";
import axiosInstance from "../../utils/axios";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

function UpdateEducationModal({ pageBehavior, onClose, initialData }) {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    user_id: user?.id,
    qualification: initialData?.qualification || "",
    from: initialData?.from || "",
    board_or_university: initialData?.board_or_university || "",
    passing_year: initialData?.passing_year || "",
    grade: initialData?.grade || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "/api/user-qualifications";
    const method = pageBehavior === "Add" ? "POST" : "PUT";

    try {
      const response = await axiosInstance({
        method: method,
        url:
          pageBehavior === "Add"
            ? endpoint
            : `/api/user-qualifications/update/${initialData?.id}`,
        data: formData,
      });

      onClose();
    } catch (error) {
      console.log(error.errors.user_id);
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow p-6 w-96">
        <h3 className="text-xl font-semibold mb-4">
          {pageBehavior} Qualification
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="qualification"
            >
              Qualification
            </label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="from">
              From
            </label>
            <input
              type="text"
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="board_or_university"
            >
              Board or University
            </label>
            <input
              type="text"
              id="board_or_university"
              name="board_or_university"
              value={formData.board_or_university}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="passing_year"
            >
              Passing Year
            </label>
            <input
              type="date"
              id="passing_year"
              name="passing_year"
              value={formData.passing_year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="grade">
              Grade
            </label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEducationModal;
