import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UserDetail {
  id: number;
  name: string;
  reading_speed: number;
  reading_accuracy: number;
  math_speed: number;
  math_accuracy: number;
  memory_score: number;
  predicted_condition: string;
}

const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/results");
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">User Details</h1>
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
        >
          Back
        </button>
      </header>

      {/* User Details Section */}
      <div className="p-6">
        {userDetails.length > 0 ? (
          <table className="table-auto w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Reading Speed</th>
                <th className="px-4 py-2">Reading Accuracy</th>
                <th className="px-4 py-2">Math Speed</th>
                <th className="px-4 py-2">Math Accuracy</th>
                <th className="px-4 py-2">Memory Score</th>
                <th className="px-4 py-2">Condition</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.reading_speed}</td>
                  <td className="px-4 py-2">{user.reading_accuracy}</td>
                  <td className="px-4 py-2">{user.math_speed}</td>
                  <td className="px-4 py-2">{user.math_accuracy}</td>
                  <td className="px-4 py-2">{user.memory_score}</td>
                  <td className="px-4 py-2">{user.predicted_condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-lg text-gray-700 mt-6">
            No user details available.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
