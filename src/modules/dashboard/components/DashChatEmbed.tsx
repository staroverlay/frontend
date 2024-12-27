import { Send } from 'lucide-react';

export default function DashChatEmbed() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Chat messages */}
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex space-x-3">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full bg-purple-500/20"
              />
              <div>
                <p>
                  <span className="font-medium text-purple-400">
                    User{i + 1}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    Hello everyone! How's the stream going?
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <button className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
