// pages/MemoryTest.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MemoryTest: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [originalNumbers, setOriginalNumbers] = useState<number[]>([]); // Keep original numbers
  const [userInput, setUserInput] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate 5 random numbers
    const generatedNumbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 10)
    );
    setNumbers(generatedNumbers);
    setOriginalNumbers(generatedNumbers); // Store original numbers for validation

    // Display numbers for 3 seconds, then clear and show input field
    const timer = setTimeout(() => {
      setNumbers([]);
      setShowInput(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    // Calculate accuracy using originalNumbers
    const correctAnswers = userInput
      .split("")
      .filter((num, idx) => parseInt(num, 10) === originalNumbers[idx]).length;
    const calculatedAccuracy = 70+((correctAnswers / originalNumbers.length) * 30);
    setAccuracy(calculatedAccuracy);

    // Navigate to results section with memory score
    navigate("/results", {
      state: {
        ...location.state,
        memoryScore: calculatedAccuracy,
      },
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Memory Test</h1>
      {numbers.length > 0 && !showInput ? (
        <p className="text-2xl font-bold">{numbers.join(" ")}</p>
      ) : showInput ? (
        <>
          <input
            type="text"
            placeholder="Enter the numbers you remember"
            onChange={(e) => setUserInput(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
          {accuracy !== null && (
            <p className="mt-4 text-lg font-semibold">
              Accuracy: {accuracy.toFixed(2)}%
            </p>
          )}
        </>
      ) : null}
    </div>
  );
};

export default MemoryTest;
