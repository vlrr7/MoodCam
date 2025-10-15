export default function StatusChip({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center space-x-3 px-6 py-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse-soft"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>
      <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300" role="status">
        {text}
      </span>
    </div>
  )
}