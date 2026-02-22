export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Analyzing Image</h3>
        <p className="text-gray-400">Running deep learning detection model...</p>
      </div>
    </div>
  );
}
