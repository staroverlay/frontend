export default function OAuthButtons() {
  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#171923] text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <img
            src="https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png"
            alt="Twitch"
            className="w-5 h-5"
          />
        </button>

        <button className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <img
            src="https://www.youtube.com/s/desktop/28b67e7f/img/favicon_32x32.png"
            alt="YouTube"
            className="w-5 h-5"
          />
        </button>

        <button className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <img
            src="https://kick.com/favicon.ico"
            alt="Kick"
            className="w-5 h-5"
          />
        </button>
      </div>
    </>
  );
}
