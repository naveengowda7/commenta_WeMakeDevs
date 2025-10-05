import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Youtube,
  BarChart3,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import React from "react";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/home");
  }

  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Youtube className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Commenta
            </span>
          </div>
          <button onClick={handleLogin} className="btn btn-primary">
            Sign in with YouTube
          </button>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Understand Your
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              YouTube Audience
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered comment analysis that helps you understand sentiment,
            spot trends, and engage with your community.
          </p>
          <button
            onClick={handleLogin}
            className="btn btn-primary text-lg inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="card p-8">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600">
                Instantly understand how your audience feels with AI-powered
                sentiment detection.
              </p>
            </div>

            <div className="card p-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Filtering</h3>
              <p className="text-gray-600">
                Filter comments by sentiment, questions, suggestions, and more.
              </p>
            </div>

            <div className="card p-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
              <p className="text-gray-600">
                Chat with an AI that knows your comments inside out.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
