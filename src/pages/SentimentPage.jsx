import { useState, useEffect } from "react";
import React from "react";

import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, ThumbsUp, MessageCircle } from "lucide-react";
import { formatNumber, getSentimentColor } from "../utils/helpers";
import Navbar from "../components/Navbar";

const SentimentPage = () => {
  const { videoId, type } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    loadData();
  }, [videoId, type]);

  const loadData = async () => {
    try {
      const [videoRes, analysisRes] = await Promise.all([
        api.videos.getVideo(videoId),
        api.analysis.getVideoAnalysis(videoId),
      ]);

      setVideo(videoRes.data);

      // Filter by type

      let filtered = analysisRes.data;
      switch (type) {
        case "positive":
        case "negative":
        case "neutral":
          filtered = filtered.filter((a) => a.sentiment === type);
          console.log(filtered);
          break;
        case "questions":
          filtered = filtered.filter((a) => a.isQuestion);
          break;
        case "suggestions":
          filtered = filtered.filter((a) => a.isSuggestion);
          break;
        case "controversial":
          filtered = filtered.filter((a) => a.isControversial);
          break;
        case "hilarious":
          filtered = filtered.filter((a) => a.isHilarious);
          console.log("its actually hilarious", filtered);
          break;
      }

      setComments(filtered);
    } catch (error) {
      console.error("Error loading data:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(`/video/${videoId}`)}
          className="btn btn-secondary mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Video
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 capitalize">
            {type} Comments
          </h1>
          <p className="text-gray-600">{video?.title}</p>
          <p className="text-sm text-gray-500 mt-2">
            Found {comments.length} comments
          </p>
        </div>

        <div className="space-y-4">
          {comments.map((analysis) => (
            <div key={analysis.analysisId} className="card p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {analysis.authorName || "Unknown"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(
                      analysis.sentiment
                    )}`}
                  >
                    {analysis.sentiment}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{analysis.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{analysis.replyCount || 0}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{analysis.commentText}</p>
              <div className="flex gap-2 mt-3">
                {analysis.isQuestion && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Question
                  </span>
                )}
                {analysis.isSuggestion && (
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Suggestion
                  </span>
                )}
                {analysis.isControversial && (
                  <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                    Controversial
                  </span>
                )}
                {analysis.isHilarious && (
                  <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                    Hilarious
                  </span>
                )}
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-gray-600">No {type} comments found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SentimentPage;
