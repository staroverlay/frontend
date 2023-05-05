import { TwitchOAuth } from "twitch-oauth";

const {
  VERCEL,
  VERCEL_URL,
  NEXT_PUBLIC_TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
} = process.env;

const twitch = new TwitchOAuth({
  clientId: NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
  clientSecret: TWITCH_CLIENT_SECRET as string,
  redirectUri: `${
    VERCEL ? "https://" + VERCEL_URL : "http://localhost:3000"
  }/login`,
  scope: ["user:read:email"],
  method: "code",
});

export default twitch;
