import { Response, Request, NextFunction } from 'express';
import { createReplySchema } from '../utils/schemas/reply.schema';
import * as replyService from '../services/reply.service';
export const getRepliesByThreadId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const threadId = req.params.threadId;
    const replies = await replyService.getRepliesByThreadId(threadId);
    res.json(replies);
  } catch (error) {
    next(error);
  }
};

export const createReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const threadId = req.params.threadId;
    const body = req.body;
    const userId = (req as any).user.id;
    const validateBody = await createReplySchema.validateAsync(body);
    const reply = await replyService.createReply(
      userId,
      threadId,
      validateBody,
    );
    res.json({
      message: 'Reply created successfully',
      data: { ...reply },
    });
  } catch (error) {
    next(error);
  }
};
