import { Request, Response, NextFunction } from 'express';
import {
  createFollowSchema,
  deleteFollowSchema,
} from '../utils/schemas/follow.schema';
import followService from '../services/follow.service';
class FollowController {
  async createFollow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/CreateFollowDTO"
                          }
                      }
                  }
              }
          */
    try {
      const body = req.body;
      console.log('followbody', body);
      const followingId = (req as any).user.id;
      const { followedId } = await createFollowSchema.validateAsync(body);
      if (followingId === followedId) {
        return res.status(400).json({ message: 'You Cannot Follow Yourself' });
      }
      await followService.createFollow({ followedId, followingId });
      res.status(201).json({ message: 'Succesfully follow user' });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found.' });
      } else if (error.message === 'Already following this user') {
        return res
          .status(409)
          .json({ message: 'You are already following this user.' });
      }
      res
        .status(500)
        .json({ message: 'Could not follow user.', error: error.message });
      next(error);
    }
  }
  async deleteFollow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const params = req.params;
      const followingId = (req as any).user.id; // Assuming 'id' is the user ID in your JWT payload
      const { followedId } = await deleteFollowSchema.validateAsync({
        followedId: params.followedId,
      });

      await followService.deleteFollow({ followedId, followingId });
      res.json({ message: 'Successfully unfollowed user.' });
    } catch (error: any) {
      if (error.message === 'Follow relationship not found') {
        return res.status(404).json({ message: 'Not following this user.' });
      }
      res
        .status(500)
        .json({ message: 'Could not unfollow user.', error: error.message });
      next(error);
    }
  }
  async getFollowers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const loggedInUserId = (req as any).user.id;
      console.log(loggedInUserId);
      if (!loggedInUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const followersWithFollowingStatus = await followService.getFollowers(
        loggedInUserId,
        userId,
      );
      res.status(200).json({
        message: 'get followers data success',
        data: followersWithFollowingStatus,
      });
    } catch (error: any) {
      console.error('Error getting followers:', error);
      res.status(500).json({
        message: 'Could not retrieve followers',
        error: error.message,
      });
      next(error);
    }
  }

  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const following = await followService.getFollowing(userId);
      res
        .status(200)
        .json({ message: 'get following data success', data: following });
    } catch (error: any) {
      console.error('Error getting following:', error);
      res.status(500).json({
        message: 'Could not retrieve following',
        error: error.message,
      });
      next(error);
    }
  }
}
export default new FollowController();
