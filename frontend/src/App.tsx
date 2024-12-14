// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReadingTest from "./pages/ReadingTest";
import MathQuiz from "./pages/MathQuiz";
import MemoryTest from "./pages/MemoryTest";
import Results from "./pages/Results";
import HomePage from "./pages/HomePage";
import UserDetails from "./pages/UserDetails";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/read-test" element={<ReadingTest />} />
        <Route path="/math-quiz" element={<MathQuiz />} />
        <Route path="/memory-test" element={<MemoryTest />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
