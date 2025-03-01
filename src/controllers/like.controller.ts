import { NextFunction, Request, Response } from 'express';
import likeService from '../services/like.service';
import {
  createLikeSchema,
  deleteLikeSchema,
} from '../utils/schemas/like.schema';

class LikeController {
  async createLike(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/CreateLikeDTO"
                          }  
                      }
                  }
              } 
          */

    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { threadId } = await createLikeSchema.validateAsync(body);
      const like = await likeService.getLikeById(userId, threadId);

      if (like) {
        res.status(400).json({
          message: 'You cannot like thread twice!',
        });
        return;
      }

      await likeService.createLike(userId, threadId);
      res.json({
        message: 'Like success!',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLike(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params;
      const userId = (req as any).user.id;
      const { threadId } = await deleteLikeSchema.validateAsync({
        threadId: params.threadId,
      });

      const like = await likeService.getLikeById(userId, threadId);

      if (!like) {
        res.status(404).json({
          message: 'Like not found!',
        });
        return;
      }

      await likeService.deleteLike(like.id);
      res.json({
        message: 'Unlike success!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LikeController();
