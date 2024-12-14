import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReadingTest: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // Counter for recording duration
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [readingAccuracy, setReadingAccuracy] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timer | null>(null);
  const navigate = useNavigate();

  const questions = [
    "The bright yellow butterfly gently landed on the blooming flower in the garden.",
    "On sunny afternoons, children love to play outside and ride their colorful bicycles.",
    "Every morning, the farmer feeds the chickens, waters the crops, and prepares for the day.",
    "In the library, people quietly read books, take notes, and explore stories from around the world.",
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
        clearInterval(timerIntervalRef.current!); // Stop the timer
        setRecordingTime(0);

        const duration = (Date.now() - (startTimeRef.current || 0)) / 1000;
        console.log("Recording duration:", duration, "seconds");

        await sendToTranscriptionService(audioBlob, duration);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      setIsRecording(true);

      // Start the timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Unable to access your microphone. Please check your permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendToTranscriptionService = async (
    audioBlob: Blob,
    duration: number
  ) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("expected_text", questions[currentIndex]);
    formData.append("duration", duration.toString());

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze_audio/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data) {
        setReadingSpeed((prev) => prev + data.reading_speed_wpm);
        setReadingAccuracy((prev) => prev + data.accuracy);
      } else {
        console.error("Error analyzing audio:", data.message);
      }
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const avgSpeed = readingSpeed / questions.length;
      const avgAccuracy = readingAccuracy / questions.length;

      navigate("/math-quiz", {
        state: { readingSpeed: avgSpeed, readingAccuracy: avgAccuracy },
      });
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Title Section */}
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
        Reading Test
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Read the sentence below aloud as quickly and accurately as you can.
        Press "Start Recording" to begin.
      </p>

      {/* Sentence Display */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <p className="text-2xl font-bold text-center text-gray-800">
          {questions[currentIndex]}
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-3 text-white text-lg font-semibold rounded-lg ${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } transition duration-300`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button
          onClick={nextQuestion}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={isRecording}
        >
          Next
        </button>
      </div>

      {/* Timer and Audio */}
      {isRecording && (
        <p className="text-center text-lg text-gray-700 mt-4">
          Recording time:{" "}
          <span className="font-semibold">{recordingTime}s</span>
        </p>
      )}
      {audioURL && <audio src={audioURL} controls className="mt-6 w-full" />}

      {/* Error Message */}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default ReadingTest;
