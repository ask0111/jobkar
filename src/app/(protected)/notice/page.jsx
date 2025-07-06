"use client";

import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import axiosInstance from "../../../utils/axios";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import moment from "moment";
import SectionContainer from "../../components/SectionContainer";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { PiBuildingOfficeDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";

const Notice = () => {
  const [applyJobs, setApplyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("accesstoken");

        if (!authToken) throw new Error("No auth token found");

        const response = await axiosInstance.get(`/api/job-applications`);
        setApplyJobs(response?.data?.data?.data);
      } catch (error) {
        console.error("Error fetching user jobs:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, []);

  return (
    <SectionContainer>
      {!loading ? (
        <div className="lg:flex gap-5 py-5">
          <div className="lg:w-2/3">
            {applyJobs?.length > 0 ? (
              applyJobs.map((item, index) => (
                <div
                  key={index}
                  className="w-full p-4 mb-3 flex gap-3 bg-white rounded-md shadow-lg  cursor-pointer"
                  onClick={() => router.push(`/jobs/${item?.job_post?.id}`)}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <p className="text-black font-semibold text-lg">
                        {item?.job_post?.title}
                      </p>
                      <div className="bg-green-600 rounded-md px-2">
                        <p className="text-white text-sm">
                          {item?.job_post?.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="flex gap-1 items-center">
                        <PiBuildingOfficeDuotone />
                        <p className="text-blue-500 text-sm">
                          {item?.job_post?.company?.name}
                        </p>
                      </div>
                    </div>

                    <p className=" text-gray-700 text-sm line-clamp-2">
                      {item?.job_post?.description}
                    </p>
                    <div className="flex gap-5 my-1">
                      <div className="flex gap-1 items-center">
                        <MdOutlineWorkOutline color="gray" />
                        <p className="text-xs">{item?.job_post?.experience}</p>
                      </div>

                      <div className="flex gap-1 items-center">
                        <GiMoneyStack color="gray" />
                        <p className="text-xs">
                          ₹{item?.job_post?.min_salary} - ₹
                          {item?.job_post?.max_salary}
                        </p>
                      </div>

                      <div className="flex gap-1 items-center ml-auto">
                        <FaCheckCircle color="green" />
                        <p className="text-xs">
                          Applied {moment(item?.created_at).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No Jobs Found</p>
            )}
          </div>
          <div className="border rounded-md lg:w-1/3 p-5 bg-white shadow-md h-fit">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              Suggested companies{" "}
            </p>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    alt="img"
                    className="h-16 w-16"
                    src="https://www.liblogo.com/img-logo/ey1267ed60-ey-logo-ernst-young-ey-logo-vector-svg-icon-png-repo-free-png-icons.png"
                  />
                  <div className="border-b w-full">
                    <p className="text-gray-700 font-semibold">
                      Spirehub Softwares
                    </p>
                    <p className="text-gray-500 text-xs">
                      Technology, Information and Internet
                    </p>
                    <button className="my-3 border-2 border-gray-500 text-gray-500 text-sm font-semibold rounded-full px-4 py-1 flex items-center gap-1">
                      {" "}
                      <FaPlus />
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </SectionContainer>
  );
};

export default Notice;
