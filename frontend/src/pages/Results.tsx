import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    readingSpeed,
    readingAccuracy,
    mathAccuracy,
    mathSpeed,
    memoryScore,
  } = location.state;

  const [prediction, setPrediction] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handlePredictionSubmit = async () => {
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

  const handleResultSubmit = async () => {
    const payload = {
      Name: name,
      Reading_Speed: readingSpeed,
      Reading_Accuracy: readingAccuracy,
      Math_Speed: mathSpeed,
      Math_Accuracy: mathAccuracy,
      Memory_Score: memoryScore,
      Predicted_Condition: prediction,
    };

    try {
      await axios.post("http://127.0.0.1:8000/results", payload);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting final results:", error);
      alert("Failed to save results. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Results</h1>

      <button
        onClick={handlePredictionSubmit}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition duration-300"
      >
        Submit Results
      </button>

      {prediction && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Predicted Condition:</span>{" "}
            {prediction}
          </p>
          <p className="text-gray-600 mb-6 text-center">
            Note: The above prediction is based on the provided scores and may
            require further assessment by a professional.
          </p>

          {!isSubmitted && (
            <div className="w-full flex flex-col items-center">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter Your Name:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-4 py-2 rounded w-64 mb-4 text-center"
                placeholder="Your Name"
              />
              <button
                onClick={handleResultSubmit}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition duration-300"
                disabled={!name}
              >
                Submit Final Results
              </button>
            </div>
          )}

          {isSubmitted && (
            <div className="text-center">
              <p className="mt-4 text-green-600 font-medium">
                Results saved successfully. Thank you!
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded shadow hover:bg-indigo-700 transition duration-300"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
