// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReadingTest from "./pages/ReadingTest";
import MathQuiz from "./pages/MathQuiz";
import MemoryTest from "./pages/MemoryTest";
import Results from "./pages/Results";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReadingTest />} />
        <Route path="/math-quiz" element={<MathQuiz />} />
        <Route path="/memory-test" element={<MemoryTest />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
