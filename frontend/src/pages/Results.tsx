// pages/Results.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Results: React.FC = () => {
  const location = useLocation();
  const {
    readingSpeed,
    readingAccuracy,
    mathAccuracy,
    mathSpeed,
    memoryScore,
  } = location.state;

  const handleSubmit = async () => {
    const payload = {
      Reading_Speed: readingSpeed,
      Reading_Accuracy: readingAccuracy,
      Math_Speed: mathSpeed,
      Math_Accuracy: mathAccuracy,
      Memory_Score: memoryScore,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        payload
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit Results
      </button>
    </div>
  );
};

export default Results;
