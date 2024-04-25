import { createTwitchIntegration } from '../../services/integrations';
import IIntegration, {
  IntegrationType,
} from '../../services/integrations/integration';
import { createSessionWithTwitch } from '../../services/sessions';
import ISessionAndUser from '../../services/sessions/session-and-user';
import { createUserWithTwitch } from '../../services/users';
import IUser from '../../services/users/user';
import { openWindow } from './window';

export async function oauthIntegration(
  type: IntegrationType,
): Promise<IIntegration | null> {
  const popup = openWindow('/oauth/' + type + '?action=redirect');
  let integration: IIntegration | null = null;

  if (type == 'twitch') {
    const code = await popup.waitMessageAndClose<string>('oauth');
    integration = code ? await createTwitchIntegration(code) : null;
  }

  return integration;
}

export function postOAuthSignal<T>(data: T) {
  if (window.opener) {
    window.opener.postMessage(
      {
        channel: 'oauth',
        data,
      },
      '*',
    );
  }
}

export async function oauthLogin(
  type: IntegrationType,
): Promise<ISessionAndUser | null> {
  const popup = openWindow('/oauth/' + type + '?action=redirect');
  let session: ISessionAndUser | null = null;

  if (type == 'twitch') {
    const code = await popup.waitMessageAndClose<string>('oauth');
    session = code ? await createSessionWithTwitch(code) : null;
  }

  return session;
}

export async function oauthRegister(
  type: IntegrationType,
): Promise<IUser | null> {
  const popup = openWindow('/oauth/' + type + '?action=redirect');
  let user: IUser | null = null;

  if (type == 'twitch') {
    const code = await popup.waitMessageAndClose<string>('oauth');
    user = code ? await createUserWithTwitch(code) : null;
  }

  return user;
}
