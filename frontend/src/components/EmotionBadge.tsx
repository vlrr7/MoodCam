import { Emotion } from "../adapters/ModelAdapter";
import cn from "classnames";

const EMOJI: Record<Emotion, string> = {
  angry: "😡",
  disgust: "🤢",
  fear: "😨",
  happy: "😊",
  sad: "😢",
  surprise: "😲",
  neutral: "😐",
};

const EMOTION_COLORS: Record<Emotion, string> = {
  happy: "from-emotion-happy-light to-emotion-happy-dark",
  sad: "from-emotion-sad-light to-emotion-sad-dark",
  angry: "from-emotion-angry-light to-emotion-angry-dark",
  fear: "from-emotion-fear-light to-emotion-fear-dark",
  disgust: "from-emotion-disgust-light to-emotion-disgust-dark",
  surprise: "from-emotion-surprise-light to-emotion-surprise-dark",
  neutral: "from-emotion-neutral-light to-emotion-neutral-dark",
};

const EMOTION_BG_COLORS: Record<Emotion, string> = {
  happy: "bg-emotion-happy-light/10",
  sad: "bg-emotion-sad-light/10",
  angry: "bg-emotion-angry-light/10",
  fear: "bg-emotion-fear-light/10",
  disgust: "bg-emotion-disgust-light/10",
  surprise: "bg-emotion-surprise-light/10",
  neutral: "bg-emotion-neutral-light/10",
};

export default function EmotionBadge({
  emotion,
  confidence,
}: {
  emotion: Emotion;
  confidence: number;
}) {
  const percentage = Math.round(confidence * 100);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-xl hover:scale-105",
        EMOTION_BG_COLORS[emotion]
      )}
      aria-live="polite"
      aria-atomic
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-20",
          EMOTION_COLORS[emotion]
        )}
      ></div>

      {/* Content */}
      <div className="relative flex items-center space-x-4">
        {/* Emoji */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-white/80 dark:bg-neutral-800/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:animate-bounce-gentle">
            <span className="text-3xl" role="img" aria-label={emotion}>
              {EMOJI[emotion]}
            </span>
          </div>
        </div>

        {/* Emotion Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 gap-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 capitalize">
              {emotion}
            </h3>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {percentage}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r shadow-inner",
                EMOTION_COLORS[emotion]
              )}
              style={{ width: `${percentage}%` }}
            >
              <div className="h-full bg-white/20 rounded-full animate-pulse-soft"></div>
            </div>
          </div>

          {/* Confidence Text */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            {percentage >= 80
              ? "Very confident"
              : percentage >= 60
              ? "Confident"
              : percentage >= 40
              ? "Moderate"
              : "Low confidence"}
          </p>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          EMOTION_COLORS[emotion]
        )}
        style={{ filter: "blur(20px)" }}
      ></div>
    </div>
  );
}
