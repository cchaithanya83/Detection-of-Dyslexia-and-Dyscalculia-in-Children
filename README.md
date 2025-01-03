# Detection of Dyslexia and Dyscalculia in Children

## Overview

This project helps in detecting potential learning disabilities such as Dyslexia and Dyscalculia in children through three interactive tests. The tool evaluates children's performance on tasks related to reading speed, math accuracy, and memory retention. By analyzing their responses, it helps in identifying learning challenges at an early stage.

### The three tests are:

1. **Reading Speed Calculation**
2. **Math Quiz for Speed and Accuracy**
3. **Memory Accuracy Test**

The frontend of the project is built with **React** (using **TypeScript** and **Tailwind CSS**), while the backend is powered by **FastAPI**. The project uses the **AssemblyAI Speech-to-Text API** to convert user speech into text for processing.

## Project Structure

```bash
main
│
├── backend (FastAPI)
│ └── main.py # FastAPI backend entry point
│
└── frontend (React + Tailwind CSS)
└── src
├── App.tsx # Main React component
├── index.tsx # Entry point for React app
└── components # React components like Header, TestSteps, etc.

```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Speech-to-Text API**: AssemblyAI
- **Development Tools**: npm, Python, FastAPI

## Features

- **Reading Speed Test**: Measures the time taken to read a sentence aloud and compares it to the original sentence to calculate the reading speed.
- **Math Quiz**: Tests the speed and accuracy of solving basic math problems. The user’s spoken answers are transcribed, and accuracy and time taken are evaluated.
- **Memory Accuracy Test**: Displays a sequence of numbers for the user to memorize and recall by typing them in the correct order.

## Installation

To run the project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dyslexia-dyscalculia-detection.git
cd dyslexia-dyscalculia-detection
```

### 2. Backend Setup (FastAPI)

Navigate to the `backend` directory and install the required Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Ensure you have your **AssemblyAI API key** for speech-to-text functionality and configure it in the backend environment.

### 3. Frontend Setup (React + Tailwind CSS)

Navigate to the `frontend` directory and install the required npm dependencies:

```bash
cd frontend
npm install
```

### 4. Run the Development Servers

#### Start the FastAPI backend:

```bash
cd backend
uvicorn main:app --reload
```

#### Start the React frontend:

```bash
cd frontend
npm run dev
```

This will launch the frontend on `http://localhost:5173` and the FastAPI backend on `http://localhost:8000`.

## How to Use

1. **Reading Speed Test**: A sentence will be displayed, and the user reads it aloud. The system will transcribe the speech and calculate the reading speed.
2. **Math Quiz**: The user is presented with simple math problems (addition, subtraction, multiplication), answers them aloud, and the system calculates both speed and accuracy.
3. **Memory Accuracy Test**: A sequence of numbers will be displayed for the user to memorize. After a short interval, the user must type them in the same order to test their memory accuracy.

## Test Steps

### 1) **Reading Speed Calculation**

- **Task**: The user is shown a sentence to read aloud.
- **Process**:
  - The sentence is displayed on the screen.
  - The user reads aloud, and the speech is transcribed using AssemblyAI's Speech-to-Text API.
  - The system compares the transcribed sentence with the original and calculates the reading speed.

### 2) **Math Quiz for Speed and Accuracy**

- **Task**: The user answers basic math questions.
- **Process**:
  - A math problem (e.g., "What is 5 + 7?") is displayed.
  - The user type the answer.
  - The backend checks the accuracy of the answer while calculating the time taken to solve the problem.

### 3) **Memory Accuracy Test**

- **Task**: The user is shown a sequence of numbers to memorize.
- **Process**:
  - A series of numbers is displayed briefly.
  - After a few seconds, the user must recall and type the sequence in the same order.
  - Accuracy is calculated based on the correct sequence typed.
