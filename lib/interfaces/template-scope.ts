type TemplateScope =
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
  },

  {
    id: "twitch:chat",
    name: "Chat",
  },

  {
    id: "twitch:emotes",
    name: "Emotes",
  },

  {
    id: "twitch:subscription",
    name: "Subscription",
  },

  {
    id: "twitch:sub-gift",
    name: "Sub Gift",
  },

  {
    id: "twitch:bits",
    name: "Bits",
  },

  {
    id: "twitch:follow",
    name: "Follow",
  },

  {
    id: "twitch:points_redemption",
    name: "Points Redemption",
  },

  {
    id: "twitch:pool",
    name: "Pool",
  },

  {
    id: "twitch:prediction",
    name: "Prediction",
  },

  {
    id: "twitch:stream-up",
    name: "Stream Up",
  },
];

export default TemplateScope;
