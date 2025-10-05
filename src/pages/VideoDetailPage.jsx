import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";

import { api } from "../services/api";
import {
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Frown,
  Smile,
  Meh,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Laugh,
} from "lucide-react";
import { formatNumber, getSentimentColor } from "../utils/helpers";
import Navbar from "../components/Navbar";
import AIChat from "../components/AIChat";

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [summary, setSummary] = useState(null);
  const [topComments, setTopComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideoData();
  }, [videoId]);

  const loadVideoData = async () => {
    try {
      const [videoRes, summaryRes, commentsRes] = await Promise.all([
        api.videos.getVideo(videoId),
        api.analysis.getSummary(videoId).catch(() => ({ data: null })),
        api.comments.getTopLiked(videoId),
      ]);

      setVideo(videoRes.data);
      setSummary(summaryRes.data);
      setTopComments(commentsRes.data.topLiked || []);
    } catch (error) {
      console.error("Error loading video:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Video not found</h2>
          <button
            onClick={() => navigate("/videos")}
            className="btn btn-primary"
          >
            Back to Videos
          </button>
        </div>
      </div>
    );
  }

  const sentimentData = summary
    ? [
        {
          label: "Positive",
          value: summary.positiveCount,
          color: "bg-green-500",
          icon: Smile,
        },
        {
          label: "Negative",
          value: summary.negativeCount,
          color: "bg-red-500",
          icon: Frown,
        },
        {
          label: "Neutral",
          value: summary.neutralCount,
          color: "bg-gray-500",
          icon: Meh,
        },
      ]
    : [];

  const insightData = summary
    ? [
        {
          label: "Questions",
          value: summary.questionCount,
          icon: HelpCircle,
          color: "text-blue-600",
        },
        {
          label: "Suggestions",
          value: summary.suggestionCount,
          icon: Lightbulb,
          color: "text-yellow-600",
        },
        {
          label: "Controversial",
          value: summary.controversialCount,
          icon: AlertTriangle,
          color: "text-orange-600",
        },
        {
          label: "Hilarious",
          value: summary.hilariousCount,
          icon: Laugh,
          color: "text-pink-600",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Video Header */}
        <div className="card p-6 mb-8">
          <div className="flex gap-6">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-64 h-36 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {video.description}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/video/${videoId}/comments`)}
                  className="btn btn-primary"
                >
                  View All Comments
                </button>
              </div>
            </div>
          </div>
        </div>

        {summary ? (
          <>
            {/* Sentiment Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {sentimentData.map((item) => (
                <div key={item.label} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-8 w-8" />
                      <span className="text-lg font-semibold">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-3xl font-bold">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{
                        width: `${(item.value / summary.totalComments) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {insightData.map((item) => (
                <div
                  key={item.label}
                  className="card p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    navigate(
                      `/video/${videoId}/sentiment/${item.label.toLowerCase()}`
                    )
                  }
                >
                  <item.icon
                    className={`h-12 w-12 mx-auto mb-3 ${item.color}`}
                  />
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Top Comments */}
            <div className="card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Top Liked Comments</h2>
              <div className="space-y-4">
                {topComments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.commentId}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">
                        {comment.authorName}
                      </span>
                      <div className="flex items-center gap-2 text-gray-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{formatNumber(comment.likeCount)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.commentText}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card p-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analysis in progress</h3>
            <p className="text-gray-600">
              We're analyzing the comments for this video. Check back soon!
            </p>
          </div>
        )}

        {/* AI Chat Component */}
        <AIChat videoId={videoId} />
      </main>
    </div>
  );
};

export default VideoDetailPage;
