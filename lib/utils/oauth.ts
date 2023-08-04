import IIntegration, { IntegrationType } from "../interfaces/integration";
import { createTwitchIntegration } from "../services/integration-service";
import { openWindow } from "./window";

export async function oauthIntegration(
  type: IntegrationType
): Promise<IIntegration | null> {
  const popup = openWindow("/oauth/" + type + "?action=redirect");
  let integration: IIntegration | null = null;

  if (type == "twitch") {
    const code = await popup.waitMessageAndClose<string>("oauth");
    integration = code ? await createTwitchIntegration(code) : null;
  }

  return integration;
}

export function postOAuthSignal<T>(data: T) {
  if (window.opener) {
    window.opener.postMessage(
      {
        channel: "oauth",
        data,
      },
      "*"
    );
  }
}
