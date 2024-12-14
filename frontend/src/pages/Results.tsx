import React, { useState } from "react";
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

  const [prediction, setPrediction] = useState<string | null>(null);

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
      setPrediction(response.data["Predicted Condition"]);
    } catch (error) {
      console.error("Error submitting results:", error);
      setPrediction("An error occurred while fetching the prediction.");
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
      {prediction && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Prediction Result</h2>
          <p className="mt-2 text-gray-700">
            <span className="font-medium">Predicted Condition:</span>{" "}
            {prediction}
          </p>
          <p className="mt-2 text-gray-600">
            Note: The above prediction is based on the provided scores and may
            require further assessment by a professional.
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
