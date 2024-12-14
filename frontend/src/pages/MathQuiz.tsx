import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MathQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const mathQuestions = [
    { question: "5 + 3", answer: 8 },
    { question: "10 - 7", answer: 3 },
    { question: "4 × 2", answer: 8 },
    { question: "15 ÷ 3", answer: 5 },
    { question: "7 + 6", answer: 13 },
    { question: "12 - 4", answer: 8 },
    { question: "9 × 1", answer: 9 },
    { question: "18 ÷ 2", answer: 9 },
    { question: "11 + 2", answer: 13 },
    { question: "20 - 10", answer: 10 },
  ];

  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (startTime) {
      const totalTime = Date.now() - startTime;
      setTimeTaken(totalTime);

      const totalMinutes = totalTime / 60000;
      const problemsPerHour = (mathQuestions.length / totalMinutes) * 3;
      const correctAnswers = answers.filter(
        (ans, idx) => ans === mathQuestions[idx].answer
      ).length;
      const accuracy = (correctAnswers / mathQuestions.length) * 100;

      navigate("/memory-test", {
        state: {
          ...location.state,
          mathAccuracy: accuracy,
          mathSpeed: problemsPerHour,
        },
      });
    }
  };

  const allAnswered = answers.length === mathQuestions.length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Math Quiz</h1>
      <p className="text-lg text-gray-700 mb-6">
        Solve the math problems below as quickly and accurately as you can.
      </p>
      <p className="text-2xl font-semibold text-gray-800 mb-8">
        Timer:{" "}
        <span className="text-blue-600">
          {Math.floor(timer / 60)}m {timer % 60}s
        </span>
      </p>
      <div className="w-full max-w-lg">
        {mathQuestions.map((q, index) => (
          <div key={index} className="mb-6">
            <p className="text-xl font-semibold mb-2">{q.question}</p>
            <input
              type="number"
              onChange={(e) => handleAnswer(index, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              placeholder="Enter your answer"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className={`mt-6 px-6 py-3 text-white text-lg font-semibold rounded-lg ${
          allAnswered
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!allAnswered}
      >
        Submit
      </button>
    </div>
  );
};

export default MathQuiz;
