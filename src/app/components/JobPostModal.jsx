"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

const JobPostModal = ({ isOpen, onClose, companyId, editingJob }) => {
  const { user } = useAuthContext();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    user_id: user?.id,
    title: "",
    description: "",
    company_id: companyId, // Initially set, but will update in useEffect
    category_id: [], // Ensuring it's always an array
    sub_category_id: [],
    experience: "",
    min_salary: "",
    max_salary: "",
    type: "Full-time",
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        user_id: user?.id,
        title: editingJob.title || "",
        description: editingJob.description || "",
        company_id: editingJob.company_id || companyId,
        category_id: [editingJob.category_id] || [],
        sub_category_id: [editingJob.sub_category_id] || [],
        experience: editingJob.experience || "",
        min_salary: editingJob.min_salary || "",
        max_salary: editingJob.max_salary || "",
        type: editingJob.type || "Full-time",
      });
    } else {
      setFormData({
        user_id: user?.id,
        title: "",
        description: "",
        company_id: companyId,
        category_id: [],
        sub_category_id: [],
        experience: "",
        min_salary: "",
        max_salary: "",
        type: "Full-time",
      });
    }
  }, [editingJob, companyId]);

  // Update company_id when companyId prop changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      company_id: companyId,
    }));
  }, [companyId]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      axiosInstance.get("/api/category").then((res) => {
        setCategories(res.data.categories || []);
      });
    }
  }, [isOpen]);

  // Fetch subcategories when category_id changes
  useEffect(() => {
    if (formData.category_id.length > 0) {
      axiosInstance
        .get(`/api/subcategory?category_id=${formData.category_id.join(",")}`)
        .then((res) => {
          setSubcategories(res.data.subcategory?.data || []);
        });
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category_id: value ? [value] : [],
    }));
  };

  // Handle subcategory selection (allowing multiple)
  const handleSubCategoryChange = (id) => {
    setFormData((prev) => {
      const selected = prev.sub_category_id.includes(id)
        ? prev.sub_category_id.filter((sid) => sid !== id)
        : [...prev.sub_category_id, id];
      return { ...prev, sub_category_id: selected };
    });
  };
  const handleSubmit = async () => {
    try {
      if (editingJob) {
        await axiosInstance.put(`/api/jobs/update/${editingJob.id}`, formData);
        alert("Job updated successfully!");
      } else {
        await axiosInstance.post("/api/jobs-post", formData);
        alert("Job posted successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit job");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="border rounded-lg p-2 w-full"
          />

          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience (e.g. 2 years)"
            className="border rounded-lg p-2 w-full"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="min_salary"
              value={formData.min_salary}
              onChange={handleChange}
              placeholder="Min Salary"
              className="border rounded-lg p-2"
            />
            <input
              name="max_salary"
              value={formData.max_salary}
              onChange={handleChange}
              placeholder="Max Salary"
              className="border rounded-lg p-2"
            />
          </div>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={4}
            className="border rounded-lg p-2 w-full"
          />

          <select
            name="category_id"
            value={formData.category_id[0] || ""}
            onChange={handleCategoryChange}
            className="border rounded-lg p-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="border rounded-lg p-2 max-h-48 overflow-y-auto">
            <label className="block font-medium mb-1">
              Select Subcategories:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {subcategories.map((sub) => (
                <label key={sub.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.sub_category_id.includes(sub.id)}
                    onChange={() => handleSubCategoryChange(sub.id)}
                  />
                  <span>{sub.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingJob ? "Update Job" : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostModal;
