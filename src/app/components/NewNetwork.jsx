import ConnectionCard from "./ConnectionCard";
import Suggestions from "./Suggestions";

const NetworkContainer = () => {
  const connections = [
    {
      name: "Akash Sharma",
      role: "HR at theoceann.com",
      image: "path-to-image",
    },
    { name: "Niyati Mishra", role: "MBA Graduate", image: "path-to-image" },
    // Add more connection objects here...
  ];

  const suggestedPeople = [
    {
      name: "Shubham Jaiswal",
      role: "Software Engineer",
      image: "path-to-image",
    },
    { name: "Rohit Pal", role: "Backend Developer", image: "path-to-image" },
    // Add more suggested people here...
  ];

  return (
    <div className="network-container">
      {/* <NetworkHeader /> */}
      <div className="connections">
        {connections.map((connection, index) => (
          <ConnectionCard
            key={index}
            name={connection.name}
            role={connection.role}
            image={connection.image}
          />
        ))}
      </div>
      <Suggestions people={suggestedPeople} />
    </div>
  );
};

export default NetworkContainer;
