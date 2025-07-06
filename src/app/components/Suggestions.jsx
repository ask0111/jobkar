import ConnectionCard from "./ConnectionCard"; // Reuse the card

const Suggestions = ({ people }) => {
  return (
    <div className="suggestions">
      <h2>People you may know from Rajkiya Engineering College Sonbhadra</h2>
      <div className="suggested-people">
        {people.map((person, index) => (
          <ConnectionCard
            key={index}
            name={person.name}
            role={person.role}
            image={person.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
