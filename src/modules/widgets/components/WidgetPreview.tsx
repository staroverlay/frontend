export default function WidgetPreview() {
  return (
    <div className="relative aspect-video bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce bg-purple-500/20 p-4 rounded-full mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-purple-400">New Subscriber!</h3>
          <p className="text-gray-400 mt-2">Thank you for subscribing!</p>
        </div>
      </div>
    </div>
  );
}
