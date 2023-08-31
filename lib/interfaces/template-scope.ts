export type TemplateScope =
  | "platform:storage"
  | "twitch:chat"
  | "twitch:emotes"
  | "twitch:subscription"
  | "twitch:sub-gift"
  | "twitch:bits"
  | "twitch:follow"
  | "twitch:points_redemption"
  | "twitch:pool"
  | "twitch:prediction"
  | "twitch:stream-up";

export const TemplateScopes = [
  {
    id: "platform:storage",
    name: "Extension Storage",
    debuggable: false,
  },

  {
    id: "twitch:chat",
    name: "Chat",
    debuggable: true,
  },

  {
    id: "twitch:emotes",
    name: "Emotes",
    debuggable: true,
  },

  {
    id: "twitch:subscription",
    name: "Subscription",
    debuggable: true,
  },

  {
    id: "twitch:sub-gift",
    name: "Sub Gift",
    debuggable: true,
  },

  {
    id: "twitch:bits",
    name: "Bits",
    debuggable: true,
  },

  {
    id: "twitch:follow",
    name: "Follow",
    debuggable: true,
  },

  {
    id: "twitch:points_redemption",
    name: "Points Redemption",
    debuggable: true,
  },

  {
    id: "twitch:pool",
    name: "Pool",
    debuggable: true,
  },

  {
    id: "twitch:prediction",
    name: "Prediction",
    debuggable: true,
  },

  {
    id: "twitch:stream-up",
    name: "Stream Up",
    debuggable: true,
  },
];

export default TemplateScope;
