import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ReadingTest: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [readingAccuracy, setReadingAccuracy] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const startTimeRef = useRef<number | null>(null); // To track the start time
  const navigate = useNavigate();

  const questions = [
    "This is a sample sentence for you to read aloud.",
    "React is a powerful library for building user interfaces.",
    "Tailwind CSS provides utility-first styling.",
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

        // Calculate duration
        const duration = (Date.now() - (startTimeRef.current || 0)) / 1000; // in seconds
        console.log("Recording duration:", duration, "seconds");

        await sendToTranscriptionService(audioBlob, duration);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now(); // Save the start time
      setIsRecording(true);
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
    formData.append("duration", duration.toString()); // Send duration to the server

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reading Test</h1>
      <p className="mb-6">{questions[currentIndex]}</p>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 text-white ${
          isRecording ? "bg-red-600" : "bg-green-600"
        } rounded`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <button
        onClick={nextQuestion}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isRecording}
      >
        Next
      </button>
      {audioURL && <audio src={audioURL} controls className="mt-4" />}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default ReadingTest;
