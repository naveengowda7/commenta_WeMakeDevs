import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import React from "react";

import { Youtube, TrendingUp, MessageSquare, Plus } from "lucide-react";
import { formatNumber, formatDate, getStatusBadge } from "../utils/helpers";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalAnalyzed: 0,
    totalComments: 0,
  });

  useEffect(() => {
    if (user) {
      console.log(user);
      api.videos
        .getUserVideos(user.userId)
        .then((res) => {
          setVideos(res.data);
          const totalAnalyzed = res.data.filter(
            (v) => v.analysisStatus === "completed"
          ).length;
          const totalComments = res.data.reduce(
            (acc, v) => acc + (v.videoSummaries?.[0]?.totalComments || 0),
            0
          );
          setStats({
            totalVideos: res.data.length,
            totalAnalyzed,
            totalComments,
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.channelName || "Creator"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your videos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Youtube className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Videos</p>
                <p className="text-3xl font-bold">{stats.totalVideos}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Analyzed</p>
                <p className="text-3xl font-bold">{stats.totalAnalyzed}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Comments</p>
                <p className="text-3xl font-bold">
                  {formatNumber(stats.totalComments)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Videos</h2>
          <button
            onClick={() => navigate("/videos")}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Analyze New Video
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="card p-12 text-center">
            <Youtube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No videos analyzed yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by analyzing your first YouTube video
            </p>
            <button
              onClick={() => navigate("/videos")}
              className="btn btn-primary"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <div
                key={video.videoId}
                className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/video/${video.videoId}`)}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatDate(video.publishedAt)}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(
                        video.analysisStatus
                      )}`}
                    >
                      {video.analysisStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {videos.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/videos")}
              className="btn btn-secondary"
            >
              View All Videos
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
