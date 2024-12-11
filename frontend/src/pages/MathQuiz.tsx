// pages/MathQuiz.tsx
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
    { question: "4 x 2", answer: 8 },
    { question: "15 / 3", answer: 5 },
    { question: "7 + 6", answer: 13 },
    { question: "12 - 4", answer: 8 },
    { question: "9 x 1", answer: 9 },
    { question: "18 / 2", answer: 9 },
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Math Quiz</h1>
      <p className="mb-4">
        Timer: {Math.floor(timer / 60)}m {timer % 60}s
      </p>
      {mathQuestions.map((q, index) => (
        <div key={index} className="mb-4">
          <p>{q.question}</p>
          <input
            type="number"
            onChange={(e) => handleAnswer(index, e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default MathQuiz;
