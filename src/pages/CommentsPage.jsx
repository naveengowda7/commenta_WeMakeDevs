import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";

import { api } from "../services/api";
import {
  ArrowLeft,
  Search,
  Filter,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { getSentimentColor } from "../utils/helpers";
import Navbar from "../components/Navbar";

const CommentsPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    loadData();
  }, [videoId, page]);

  useEffect(() => {
    filterComments();
  }, [searchTerm, sentimentFilter, comments]);

  const loadData = async () => {
    try {
      const [videoRes, commentsRes, analysisRes] = await Promise.all([
        api.videos.getVideo(videoId),
        api.comments.getVideoComments(videoId, page),
        api.analysis.getVideoAnalysis(videoId),
      ]);

      setVideo(videoRes.data);
      setTotalComments(commentsRes.data.total);

      // Merge comments with analysis
      const commentsWithAnalysis = commentsRes.data.comments.map((comment) => {
        const analysis = analysisRes.data.find(
          (a) => a.commentId === comment.commentId
        );
        return { ...comment, analysis };
      });

      setComments(commentsWithAnalysis);
      setFilteredComments(commentsWithAnalysis);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterComments = () => {
    let filtered = comments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.commentText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sentiment filter
    if (sentimentFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.analysis?.sentiment === sentimentFilter
      );
    }

    setFilteredComments(filtered);
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
          <h1 className="text-3xl font-bold mb-2">All Comments</h1>
          <p className="text-gray-600">{video?.title}</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment.commentId} className="card p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{comment.authorName}</span>
                  {comment.analysis && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(
                        comment.analysis.sentiment
                      )}`}
                    >
                      {comment.analysis.sentiment}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{comment.replyCount || 0}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{comment.commentText}</p>

              {comment.analysis && (
                <div className="flex gap-2 mt-3">
                  {comment.analysis.isQuestion && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Question
                    </span>
                  )}
                  {comment.analysis.isSuggestion && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Suggestion
                    </span>
                  )}
                  {comment.analysis.isControversial && (
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      Controversial
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredComments.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-gray-600">
                No comments found matching your filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalComments > 100 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 100 >= totalComments}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommentsPage;
