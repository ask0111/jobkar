"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import axiosInstance from "../../utils/axios";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Loader from "./Loader";

function Skill() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [editingSkillId, setEditingSkillId] = useState(null);

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/api/user-skills/${user?.id}`);
      setSkills(res.data.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(`/api/category`);
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const res = await axiosInstance.get(
        `/api/subcategory?category_id=${categoryId}`
      );
      setSubcategories(res.data.subcategory.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSkillSubmit = async () => {
    if (!selectedCategory || selectedSubcategories.length === 0) return;

    try {
      if (editingSkillId) {
        // Update Skill
        await axiosInstance.put(`/api/user-skills/update/${editingSkillId}`, {
          category_id: [selectedCategory],
          sub_category_id: selectedSubcategories,
        });
      } else {
        // Add New Skill
        await axiosInstance.post("/api/user-skills", {
          user_id: user?.id,
          category_id: [selectedCategory],
          sub_category_id: selectedSubcategories,
        });
      }

      fetchSkills(); // Refresh skills after adding/updating
      closeModal();
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await axiosInstance.delete(`/api/user-skills/delete/${id}`);
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const openEditModal = (skill) => {
    setSelectedCategory(skill.category_id);
    setSelectedSubcategories(skill.sub_category_id);
    setEditingSkillId(skill.id);
    setModalOpen(true);
    fetchSubcategories(skill.category_id); // Load subcategories
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory("");
    setSelectedSubcategories([]);
    setEditingSkillId(null);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Skills & Endorsements</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow flex items-center gap-2 hover:bg-blue-600"
        >
          <FiPlus size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow"
          >
            <p>{skill.sub_category_names}</p>
            <div className="flex gap-2">
              {/* <button onClick={() => openEditModal(skill)} className="text-blue-500 hover:text-blue-600">
                <FiEdit2 size={18} />
              </button> */}
              <button
                onClick={() => deleteSkill(skill.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingSkillId ? "Edit Skill" : "Add Skill"}
            </h3>

            <label className="block mb-2">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchSubcategories(e.target.value);
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {subcategories.length > 0 && (
              <div className="mt-4">
                <label className="block mb-2">Select Subcategories</label>
                <div className="max-h-40 overflow-y-auto border p-2 rounded-md">
                  {subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories?.includes(sub.id)}
                        value={sub.id}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setSelectedSubcategories((prev) =>
                            e.target.checked
                              ? [...prev, id]
                              : prev?.filter((sid) => sid !== id)
                          );
                        }}
                      />
                      <label>{sub.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSkillSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingSkillId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Skill;
