import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axios";

const CompanyRegistrationDialog = ({ isOpen, onClose, recruiterId, email }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    recruiter_id: recruiterId,
    email: email,
    phone: "",
    gst_number: "",
    industry_type_id: "",
    image_url: null,
    website: "",
    size: "",
    identity: null,
    proof_document: null,
    ownership: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (isOpen) {
      axiosInstance.get("/api/industry-type").then((res) => {
        setIndustryTypes(res.data.data.data);
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post("/api/companies", data);
      alert("Company Registered Successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Registration Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Register Your Company</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            &times;
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className={`bg-blue-600 h-2.5 rounded-full`}
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-4">
            <input
              name="name"
              placeholder="Company Name"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="gst_number"
              placeholder="GST Number"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="industry_type_id"
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Industry Type</option>
              {industryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <input
              name="image_url"
              type="file"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 gap-4">
            <input
              name="website"
              placeholder="Website"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="size"
              placeholder="Company Size"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="identity"
              type="file"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="proof_document"
              type="file"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="ownership"
              placeholder="Ownership Type"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 gap-4">
            <input
              name="country"
              placeholder="Country"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <textarea
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationDialog;
