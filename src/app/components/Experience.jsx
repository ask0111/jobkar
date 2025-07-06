import React, { useEffect, useState } from "react";
import ExperienceFormModal from "./ExperienceFormModal";
import axiosInstance from "../../utils/axios";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import Loader from "./Loader";
import { formatDate } from "../../utils/DateFormat";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

function Experience() {
  const [experienceModal, setExperienceModal] = useState(false);
  const [editExperienceData, setEditExperienceData] = useState({});
  const [experience, setExperience] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const toggleExperienceModal = () => {
    setExperienceModal(!experienceModal);
    fetchData();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const experienceRes = await axiosInstance.get(
        `/api/user-experience/${user?.id}`
      );
      setExperience(experienceRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteExperience = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (isConfirmed) {
      try {
        await axiosInstance.delete(`/api/user-experience/delete/${id}`);
        setExperience((prev) => prev.filter((exp) => exp.id !== id));
      } catch (error) {
        console.error("Error deleting experience:", error);
      }
    }
  };
  if (isLoading) return <Loader />;

  return (
    <div className="profile-section profile-experience">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Experience</h3>
        <button
          onClick={() => {
            setEditExperienceData(null);
            toggleExperienceModal();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          <FiPlus size={18} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow"
          >
            <div>
              <h4>
                {exp.company_name}, {exp?.company_location}
              </h4>
              <p>{exp.designation}</p>
              <p>
                {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  toggleExperienceModal();
                  setEditExperienceData(exp);
                }}
                className="text-blue-500 hover:text-blue-600"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => handleDeleteExperience(exp.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {experienceModal && (
        <ExperienceFormModal
          isOpen={experienceModal}
          onClose={toggleExperienceModal}
          experienceData={editExperienceData}
        />
      )}
    </div>
  );
}

export default Experience;
