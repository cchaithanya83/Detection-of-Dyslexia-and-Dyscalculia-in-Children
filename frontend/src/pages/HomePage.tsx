import React from "react";
import { useNavigate } from "react-router-dom"; // For navigating to the test page

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Using navigate for page redirection

  const goToTest = () => {
    navigate("/read-test"); // Navigate to the first test (Reading Test) page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white flex justify-between items-center px-8 py-4">
        <h1 className="text-4xl font-bold">
          Detection of Dyslexia and Dyscalculia in Children
        </h1>
        <button
          onClick={() => navigate("/user-details")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
        >
          View All User Details
        </button>
      </header>

      {/* Project Information Section */}
      <section className="px-8 py-12">
        <h2 className="text-3xl font-semibold mb-4">About</h2>
        <p className="text-lg text-gray-700">
          This aims to detect signs of Dyslexia and Dyscalculia in children
          hrough a series of interactive tests. By evaluating the reading speed,
          math quiz performance, and memory accuracy of children, the project
          helps identify potential learning disabilities and provides insight
          into their learning patterns.
        </p>
      </section>

      {/* Test Steps Section */}
      <section className="px-8 py-12 bg-gray-200">
        <h2 className="text-3xl font-semibold mb-4">Steps for the Test</h2>
        <ol className="list-decimal pl-6 space-y-4 text-lg text-gray-700">
          <li>
            <strong>1) Reading Speed Calculation:</strong>
            <p>
              The user is shown a sentence to read aloud. The time taken to read
              the sentence is measured and compared with the original sentence
              to calculate reading speed.
            </p>
          </li>
          <li>
            <strong>2) Math Quiz for Speed and Accuracy:</strong>
            <p>
              The user solves math problems, and their spoken answers are
              transcribed. The time taken to answer and accuracy are evaluated.
            </p>
          </li>
          <li>
            <strong>3) Memory Accuracy Test:</strong>
            <p>
              The user is shown a series of numbers and asked to recall and type
              them in the correct order. The accuracy of the sequence entered is
              calculated.
            </p>
          </li>
        </ol>
      </section>

      {/* Go to Test Button Section */}
      <section className="text-center py-12">
        <button
          onClick={goToTest}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Start the Test
        </button>
      </section>
    </div>
  );
};

export default HomePage;
