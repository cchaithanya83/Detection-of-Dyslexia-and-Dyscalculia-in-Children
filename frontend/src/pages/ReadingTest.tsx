// pages/ReadingTest.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ReadingTest: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [readingAccuracy, setReadingAccuracy] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const navigate = useNavigate();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: Blob[] = [];

  const questions = [
    "This is a sample sentence for you to read aloud.",
    "React is a powerful library for building user interfaces.",
    "Tailwind CSS provides utility-first styling.",
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const recordingEndTime = Date.now();
    const duration = recordingStartTime
      ? (recordingEndTime - recordingStartTime) / 1000
      : 0;
    setRecordingStartTime(null);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (audioBlob) {
      // Call the API with audioBlob, duration, and expected text
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
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      console.log(readingAccuracy);
      console.log(readingAccuracy);
      setCurrentIndex((prev) => prev + 1);
      setAudioBlob(null); // Reset audioBlob for the next question
    } else {
      const avgSpeed = readingSpeed / questions.length;
      const avgAccuracy = readingAccuracy / questions.length;
      console.log(avgAccuracy, avgSpeed);

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
        disabled={isRecording} // Disable "Next" while recording
      >
        Next
      </button>
    </div>
  );
};

export default ReadingTest;
