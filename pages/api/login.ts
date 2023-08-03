import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/graphql/client";
import CreateSessionMutation from "../../lib/graphql/mutations/createSessionMutation";

import Response from "../../lib/interfaces/response";
import Twitch from "../../lib/utils/twitch";

interface Payload {
  code?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { code } = req.body as Payload;
  if (!code) {
    return res.status(400).json({
      error: {
        field: "code",
        kind: "REQUIRED_FIELD",
        message: "You must specify the field 'code'.",
      },
    });
  }

  const oauth = await Twitch.verifyCodeResponse(code).catch((e) => {
    res.status(e.status).json({
      error: {
        kind: "AUTH_ERROR",
        message: e.message,
      },
    });

    return null;
  });

  if (oauth) {
    const data = await client
      .fetch(CreateSessionMutation, {
        access_token: oauth.access_token,
        refresh_token: oauth.refresh_token,
      })
      .catch((e) => {
        res.status(400).json({
          error: {
            kind: "AUTH_ERROR",
            message: e.message,
          },
        });

        return null;
      });

    if (data) {
      res.status(200).json(data);
    }
  }
}
