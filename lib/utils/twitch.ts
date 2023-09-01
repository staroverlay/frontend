import { TwitchOAuth } from "twitch-oauth";

const isBrowser =
  typeof globalThis !== "undefined" &&
  typeof globalThis["window"] !== "undefined";

const getRedirectURI = () => {
  if (isBrowser) {
    const proto = window.location.protocol;
    const host = window.location.host;
    return `${proto}//${host}/oauth/twitch`;
  } else {
    return `http://localhost:3000/`;
  }
};

const twitch = new TwitchOAuth({
  clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
  clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
  redirectUri: getRedirectURI(),
  scope: ["user:read:email"],
  method: "code",
});

export default twitch;
