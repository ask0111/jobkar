import React, { useState } from "react";

const CategoryCard = ({ categoryData }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold">Categories</h3>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleCategoryClick("all")}
          className={`px-3 py-1 text-xs rounded-full shadow-md transition-all border border-gray-300 
            ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
        >
          All
        </button>
        {categoryData.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-3 py-1 text-xs rounded-full shadow-md transition-all border border-gray-300 
              ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
