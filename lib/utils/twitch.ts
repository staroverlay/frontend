import { TwitchOAuth } from 'twitch-oauth';

const isBrowser =
  typeof globalThis !== 'undefined' &&
  typeof globalThis['window'] !== 'undefined';

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
  scope: [
    'bits:read',
    'channel:edit:commercial',
    'channel:moderate',
    'channel:manage:ads',
    'channel:manage:broadcast',
    'channel:manage:guest_star',
    'channel:manage:moderators',
    'channel:manage:polls',
    'channel:manage:predictions',
    'channel:manage:raids',
    'channel:manage:redemptions',
    'channel:manage:vips',
    'channel:read:charity',
    'channel:read:goals',
    'channel:read:guest_star',
    'channel:read:hype_train',
    'channel:read:polls',
    'channel:read:predictions',
    'channel:read:redemptions',
    'channel:read:subscriptions',
    'chat:read',
    'moderation:read',
    'moderator:read:shoutouts',
    'moderator:manage:shoutouts',
    'user:read:broadcast',
    'user:read:email',
  ],
  method: 'code',
});

export default twitch;
