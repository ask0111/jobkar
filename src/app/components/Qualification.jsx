"use client";

import { useEffect, useState } from "react";
import UpdateEducationModal from "./UpdateEducationModal";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import axiosInstance from "../../utils/axios";
import Loader from "./Loader";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

function Qualification() {
  const [qualificationModal, setQualificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editQualificationData, setEditQualificationData] = useState({});
  const [qualification, setQualification] = useState([]);
  const [pageBehavior, setPageBehaviour] = useState("Add");

  const { user } = useAuthContext();

  const handleEducationModal = () => {
    setQualificationModal(!qualificationModal);
    fetchData();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const qualificationRes = await axiosInstance.get(
        `/api/user-qualifications/${user?.id}`
      );
      setQualification(qualificationRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEducation = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (isConfirmed) {
      try {
        await axiosInstance.delete(`/api/user-qualifications/delete/${id}`);
        setQualification((prev) => prev.filter((exp) => exp.id !== id));
      } catch (error) {
        console.error("Error deleting experience:", error);
      }
    }
  };
  if (isLoading) return <Loader />;
  return (
    <div className="profile-section profile-education">
      {qualificationModal && (
        <UpdateEducationModal
          onClose={handleEducationModal}
          initialData={editQualificationData}
          pageBehavior={pageBehavior}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Education</h3>
        <button
          onClick={() => {
            setPageBehaviour("Add");
            handleEducationModal();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          <FiPlus size={18} />
        </button>
      </div>
      <div className="">
        {qualification &&
          qualification?.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow">
              <div className="pt-2 border-t">
                <p className=" font-semibold">{item.qualification}</p>
                <p>{item.board_or_university}</p>
                <p>{item.from}</p>
                <p>Passing year: {item.passing_year}</p>
                <p>Grade: {item.grade}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditQualificationData(item);
                    setPageBehaviour("Edit");
                    handleEducationModal();
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteEducation(item?.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* {qualificationModal && (
              <UpdateEducationModal onClose={handleEducationModal} />
            )} */}
    </div>
  );
}

export default Qualification;
