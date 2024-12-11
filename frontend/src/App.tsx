import React, { useState, useRef } from "react";
import axios from "axios";

const ReadingSpeedCalculator: React.FC = () => {
  // State variables
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [readingTime, setReadingTime] = useState<number | null>(null);
  const [readingSpeed, setReadingSpeed] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const questions = [
    "This is a sample sentence for you to read aloud.",
    "Reading speeds are important for educational purposes.",
    "Technology is rapidly evolving in the 21st century.",
    "The quick brown fox jumps over the lazy dog.",
    "Understanding algorithms is key to solving complex problems.",
  ];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording audio
  const startRecording = () => {
    audioChunksRef.current = []; // Clear previous audio chunks
    setIsRecording(true);
    

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          setAudioBlob(audioBlob);

          // Create a URL for the recorded audio to be played
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit audio to the backend for transcription
  const submitAudio = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav"); // Make sure the file is named appropriately


      try {
        // Send audio file to the backend for transcription
        const response = await axios.post(
          "http://127.0.0.1:8000/transcribe/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Get the transcribed text from the backend response
        const transcribed = response.data.transcribed_text;
        setTranscribedText(transcribed);

        // Calculate the time taken to read
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time in seconds
        setReadingTime(timeTaken);

        // Calculate reading speed (words per minute)
        const wordCount = transcribed.split(" ").length;
        const wordsPerMinute = (wordCount / timeTaken) * 60;
        setReadingSpeed(wordsPerMinute);
      } catch (error) {
        console.error("Error during transcription:", error);
      }
    }
  };

  // Handle next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAudioBlob(null);
      setAudioUrl("");
      setTranscribedText("");
      setReadingTime(null);
      setReadingSpeed(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Reading Speed Calculator
        </h1>

        {/* Question */}
        <div className="mb-6">
          <p className="text-lg text-gray-800">
            Read the following sentence aloud:
          </p>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {questions[currentQuestionIndex]}
          </p>
        </div>

        {/* Start/Stop recording buttons */}
        <div className="flex justify-center gap-6 mb-6">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none"
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none"
            >
              Start Recording
            </button>
          )}
        </div>

        {/* Display audio file (URL) */}
        {audioUrl && (
          <div className="mb-6 text-center">
            <p className="text-gray-700">Recording Preview:</p>
            <audio controls className="mx-auto">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Submit button to send the audio to backend */}
        {audioBlob && !isRecording && (
          <div className="flex justify-center mb-6">
            <button
              onClick={submitAudio}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
            >
              Submit
            </button>
          </div>
        )}

        {/* Display results after transcription */}
        {transcribedText && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Transcribed Text
            </h3>
            <p className="text-gray-800 mb-2">{transcribedText}</p>
            <p className="text-gray-700">
              Time Taken: {readingTime?.toFixed(2)} seconds
            </p>
            <p className="text-gray-700">
              Reading Speed: {readingSpeed?.toFixed(2)} words per minute
            </p>
          </div>
        )}

        {/* Next Button */}
        {currentQuestionIndex < questions.length - 1 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingSpeedCalculator;
