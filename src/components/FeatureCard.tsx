import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
      <div className="flex justify-center mb-2 lg:mb-4">{icon}</div>
      <h3 className="text-lg lg:text-xl font-semibold mb-1 lg:mb-2">{title}</h3>
      <p className="text-sm lg:text-base text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
