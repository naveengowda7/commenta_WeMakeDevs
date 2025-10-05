import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, createWebSocket } from "../services/api";
import React from "react";

import { Youtube, Search, Plus, Loader } from "lucide-react";
import { formatDate, getStatusBadge } from "../utils/helpers";
import Navbar from "../components/Navbar";

const VideosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoIdInput, setVideoIdInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchingVideoId, setFetchingVideoId] = useState(null);

  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user]);

  const loadVideos = () => {
    api.videos
      .getUserVideos(user.userId)
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleStartFetch = async () => {
    if (!videoIdInput.trim()) return;

    setFetching(true);
    setFetchingVideoId(videoIdInput);

    try {
      await api.fetch.start(videoIdInput);

      // Connect to WebSocket for real-time updates
      const ws = createWebSocket("fetch", videoIdInput, (data) => {
        console.log("WebSocket update:", data);
        if (data.type === "fetch_completed") {
          loadVideos();
          setFetching(false);
        }
      });

      setTimeout(() => {
        loadVideos();
        setVideoIdInput("");
      }, 2000);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to start fetching. Please check the video ID.");
      setFetching(false);
    }
  };

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
          <h1 className="text-4xl font-bold mb-2">Your Videos</h1>
          <p className="text-gray-600">Analyze YouTube comments with AI</p>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Analyze New Video</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter YouTube Video ID (e.g., dQw4w9WgXcQ)"
              value={videoIdInput}
              onChange={(e) => setVideoIdInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={fetching}
            />
            <button
              onClick={handleStartFetch}
              disabled={fetching || !videoIdInput.trim()}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {fetching ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Start Analysis
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Enter the video ID from the YouTube URL. Example:
            youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
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

        {videos.length === 0 && !fetching && (
          <div className="card p-12 text-center">
            <Youtube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-gray-600">
              Enter a YouTube video ID above to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideosPage;
