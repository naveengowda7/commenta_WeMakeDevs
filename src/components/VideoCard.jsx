import { useNavigate } from "react-router-dom";
import { formatDate, getStatusBadge } from "../utils/helpers";
import React from "react";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/video/${video.videoId}`)}
    >
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
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
  );
};

export default VideoCard;
