# Joblens - AI-Powered Job & Learning Platform

Joblens is a modern, AI-driven web application designed to bridge the gap between job seekers and opportunities. It provides personalized job and learning resource recommendations, AI-powered career roadmap generation, and automated CV analysis to help users navigate their career paths effectively.

## ✨ Features

- **User Authentication:** Secure registration and login with JWT-based authentication.
- **Personalized Dashboard:** A central hub for users to view recommended jobs, learning resources, and track their career progress.
- **AI-Powered Recommendations:**
  - **Job Matching:** Recommends jobs based on a user's skills, experience, and career track, complete with a match score and reasoning.
  - **Skill Gap Analysis:** Identifies missing skills for a desired job and suggests relevant learning resources to fill the gaps.
- **Dynamic Job & Resource Search:** Users can search, filter, and browse extensive lists of jobs and learning materials.
- **AI Career Roadmap:** Generates a personalized, step-by-step learning plan to help users achieve their career goals.
- **CV Auto-Analysis:** Automatically extracts and summarizes skills, tools, and roles from a user's resume.
- **AI-Generated CV:** Creates a professional CV layout based on the user's profile data, which can be downloaded as a PDF.
- **Admin Dashboard:** Special interface for administrators to manage job listings.
- **Floating AI Chatbot:** An integrated career assistant to answer user queries in real-time.

## 🛠️ Tech Stack

- **Frontend:** React (with Vite), React Router
- **Styling:** Tailwind CSS with DaisyUI
- **State Management & Data Fetching:** TanStack Query (React Query) & Axios
- **UI Components:** Lottie for animations, Lucide React for icons
- **PDF Generation:** `@react-pdf/renderer` for client-side PDF creation.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ahammad204/Joblens.git
    cd Joblens
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the `Joblens` directory and add the following variables. This file is ignored by Git.

    ```env
    # The base URL for the backend server
    VITE_API_BASE_URL=http://localhost:5000

    # API key from ImgBB for image uploads (used in registration)
    VITE_IMGBB_KEY=<your_imgbb_api_key>
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## 🚢 Deployment

This is a standard Vite-based React application. To deploy, follow these steps:

1.  **Build the project:**
    ```bash
    npm run build
    ```
2.  **Deploy the `dist` folder:**
    The contents of the generated `dist` folder can be deployed to any static hosting service, such as:
    - [Vercel](https://vercel.com/)
    - [Netlify](https://www.netlify.com/)
    - [GitHub Pages](https://pages.github.com/)

    Ensure you configure the environment variables (`VITE_API_BASE_URL`, `VITE_IMGBB_KEY`) in your hosting provider's settings.