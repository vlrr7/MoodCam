import { useStore } from "../state/useStore";
import { Emotion } from "../adapters/ModelAdapter";
import { useState } from "react";

const EMOTION_EMOJIS: Record<Emotion, string> = {
  angry: "😡",
  disgust: "🤢", 
  fear: "😨",
  happy: "😊",
  sad: "😢",
  surprise: "😲",
  neutral: "😐",
};

const EMOTION_COLORS: Record<Emotion, string> = {
  happy: "from-yellow-400 to-orange-500",
  sad: "from-blue-400 to-blue-600", 
  angry: "from-red-400 to-red-600",
  fear: "from-purple-400 to-purple-600",
  disgust: "from-green-400 to-green-600",
  surprise: "from-teal-400 to-teal-600",
  neutral: "from-gray-400 to-gray-600",
};

const EMOTION_BG_COLORS: Record<Emotion, string> = {
  happy: "bg-yellow-50 dark:bg-yellow-900/20",
  sad: "bg-blue-50 dark:bg-blue-900/20",
  angry: "bg-red-50 dark:bg-red-900/20", 
  fear: "bg-purple-50 dark:bg-purple-900/20",
  disgust: "bg-green-50 dark:bg-green-900/20",
  surprise: "bg-teal-50 dark:bg-teal-900/20",
  neutral: "bg-gray-50 dark:bg-gray-900/20",
};

export default function HistoryPanel() {
  const { history, filter, setFilter, clearHistory } = useStore();
  const [sortBy, setSortBy] = useState<'time' | 'confidence'>('time');
  
  const items = history
    .filter((h) => filter === "all" ? true : h.emotion === filter)
    .sort((a, b) => {
      if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      }
      return b.timestamp - a.timestamp;
    });

  const emotionStats = history.reduce((acc, item) => {
    acc[item.emotion] = (acc[item.emotion] || 0) + 1;
    return acc;
  }, {} as Record<Emotion, number>);

  return (
    <div className="card-glass space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Emotion History
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {history.length} total detections
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
          title="Clear History"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Emotion Statistics */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(emotionStats).map(([emotion, count]) => (
          <div
            key={emotion}
            className={`${EMOTION_BG_COLORS[emotion as Emotion]} rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-700/50`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{EMOTION_EMOJIS[emotion as Emotion]}</span>
              <div>
                <div className="font-semibold text-sm capitalize">{emotion}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{count} times</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Filter by Emotion
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Emotions</option>
            {Object.keys(EMOTION_EMOJIS).map((emotion) => (
              <option key={emotion} value={emotion}>
                {EMOTION_EMOJIS[emotion as Emotion]} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="sm:w-32">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="time">Time</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400">No emotions detected yet</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">Start detection to see your emotion history</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.timestamp}-${index}`}
              className={`${EMOTION_BG_COLORS[item.emotion]} rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-xl">{EMOTION_EMOJIS[item.emotion]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                      {item.emotion}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {Math.round(item.confidence * 100)}%
                  </div>
                  <div className="w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${EMOTION_COLORS[item.emotion]}`}
                      style={{ width: `${item.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
