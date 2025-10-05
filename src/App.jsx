import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import VideosPage from "./pages/VideosPage";
import VideoDetailPage from "./pages/VideoDetailPage";
import SentimentPage from "./pages/SentimentPage";
import CommentsPage from "./pages/CommentsPage";
import AuthCallback from "./pages/AuthCallback";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/success" element={<AuthCallback />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <VideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <ProtectedRoute>
                <VideoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoId/sentiment/:type"
            element={
              <ProtectedRoute>
                <SentimentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoId/comments"
            element={
              <ProtectedRoute>
                <CommentsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
