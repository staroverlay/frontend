import type { NextApiRequest, NextApiResponse } from 'next';

import Proxy from '@/lib/clients/proxy';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).json({ message: 'Missing URL' });
    return;
  }

  const { headers, data, status } = await Proxy.get(url, {
    responseType: 'arraybuffer',
  });

  if (status === 200) {
    res.setHeader('Content-Type', headers['content-type']);
    res.setHeader('Content-Length', headers['content-length']);
    res.send(data);
  } else {
    res.status(status).json({
      message: 'Failed to fetch image. Request end with status ' + status,
    });
  }
}
