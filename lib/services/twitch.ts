import { TwitchOAuth } from "twitch-oauth";

const twitch = new TwitchOAuth({
  clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
  clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
  redirectUri: `${
    process.env.VERCEL
      ? "https://" + process.env.VERCEL_URL
      : "http://localhost:3000"
  }/login`,
  scope: ["user:read:email"],
  method: "code",
});

export default twitch;
