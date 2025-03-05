import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextFunction, Request, Response } from 'express';

export function rateLimit(identifier: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '10 s'),
    });

    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      res.json({
        message: 'Unable to process at this time',
      });
      return;
    }

    next();
  };
}
