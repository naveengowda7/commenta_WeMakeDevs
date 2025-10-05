import React from "react";

const SentimentChart = ({ summary }) => {
  if (!summary) return null;

  const total = summary.totalComments;
  const data = [
    {
      label: "Positive",
      value: summary.positiveCount,
      color: "bg-green-500",
      percentage: ((summary.positiveCount / total) * 100).toFixed(1),
    },
    {
      label: "Negative",
      value: summary.negativeCount,
      color: "bg-red-500",
      percentage: ((summary.negativeCount / total) * 100).toFixed(1),
    },
    {
      label: "Neutral",
      value: summary.neutralCount,
      color: "bg-gray-500",
      percentage: ((summary.neutralCount / total) * 100).toFixed(1),
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold mb-4">Sentiment Distribution</h3>

      {/* Bar Chart */}
      <div className="space-y-4 mb-6">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{item.label}</span>
              <span className="text-gray-600">
                {item.value} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${item.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart Visualization */}
      <div className="flex items-center justify-center gap-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="transform -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray={`${data[0].percentage} ${
                100 - data[0].percentage
              }`}
              strokeDashoffset="0"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray={`${data[1].percentage} ${
                100 - data[1].percentage
              }`}
              strokeDashoffset={`-${data[0].percentage}`}
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#6b7280"
              strokeWidth="4"
              strokeDasharray={`${data[2].percentage} ${
                100 - data[2].percentage
              }`}
              strokeDashoffset={`-${data[0].percentage + data[1].percentage}`}
            />
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${item.color}`}></div>
              <span className="text-sm">
                {item.label}: {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;
