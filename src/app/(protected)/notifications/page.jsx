"use client";

import SectionContainer from "../../components/SectionContainer";
import { UserControlCard } from "../../components/UserControlCard";
import { PolicyControlCard } from "../../components/UserControlCard";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: "New Job Listing",
      message: "A new job matching your preferences is available.",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Application Update",
      message: "Your application for Software Engineer has been viewed.",
      time: "1 day ago",
    },
    {
      id: 3,
      title: "Interview Invitation",
      message: "You have been invited for an interview at XYZ Corp.",
      time: "3 days ago",
    },
    {
      id: 4,
      title: "System Update",
      message: "We've improved our job search algorithm.",
      time: "1 week ago",
    },
  ];

  return (
    <SectionContainer className="lg:flex lg:gap-5 my-5">
      <div className="p-6 bg-white shadow-md rounded-lg lg:w-3/4 h-max">
        <h1 className="text-xl text-gray-700 font-bold mb-2">Notifications</h1>
        <p className="mb-4 text-sm">
          Stay updated with the latest job opportunities, application statuses,
          and important alerts.
        </p>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-md font-semibold">{notification.title}</h2>
                <p className="text-gray-600 text-sm">{notification.message}</p>
              </div>
              <span className="text-sm text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:w-1/4">
        <UserControlCard />
        <PolicyControlCard />
      </div>
    </SectionContainer>
  );
};

export default Notifications;
