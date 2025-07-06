import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axios";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

const ExperienceFormModal = ({ isOpen, onClose, experienceData }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState(
    experienceData || {
      user_id: user?.id,
      company_name: "",
      designation: "",
      project_name: "",
      role_and_responsbility: "",
      team_size: "",
      project_url: "",
      description: "",
      company_location: "",
      start_date: "",
      end_date: "",
      is_current: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = experienceData
        ? `/api/user-experience/update/${experienceData?.id}`
        : "/api/user-experience";
      if (experienceData) {
        await axiosInstance.put(url, formData);
      } else {
        await axiosInstance.post(url, formData);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto mt-4">
          <h2 className="text-xl font-semibold mb-4">
            {experienceData ? "Update Experience" : "Add Experience"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              placeholder="Project Name"
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              name="role_and_responsbility"
              value={formData.role_and_responsbility}
              onChange={handleChange}
              placeholder="Role and Responsibility"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="team_size"
              type="number"
              value={formData.team_size}
              onChange={handleChange}
              placeholder="Team Size"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="project_url"
              type="url"
              value={formData.project_url}
              onChange={handleChange}
              placeholder="Project URL"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="company_location"
              value={formData.company_location}
              onChange={handleChange}
              placeholder="Company Location"
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              disabled={formData.is_current}
              required={!formData.is_current}
              className="w-full p-2 border rounded"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_current"
                checked={formData.is_current}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Currently Working Here</span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {experienceData ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ExperienceFormModal;
