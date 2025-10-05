import { ThumbsUp, MessageCircle } from "lucide-react";
import { getSentimentColor } from "../utils/helpers";
import React from "react";

const CommentCard = ({ comment, showAnalysis = true }) => {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{comment.authorName}</span>
          {showAnalysis && comment.analysis && (
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

      {showAnalysis && comment.analysis && (
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
          {comment.analysis.isHilarious && (
            <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
              Hilarious
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
