import { Profile, User } from '@prisma/client';
import { prisma } from '../lib/prisma';
interface CreateFollowInput {
  followedId: string;
  followingId: string;
}

interface DeleteFollowInput {
  followedId: string;
  followingId: string;
}
type FollowerWithFollowingStatus = Pick<User, 'id' | 'username' | 'email'> & {
  profile: Profile | null;
  isFollowing: boolean;
};
class FollowService {
  async createFollow(data: CreateFollowInput) {
    try {
      // Check if the users exist
      const followedUser = await prisma.user.findUnique({
        where: { id: data.followedId },
      });
      const followingUser = await prisma.user.findUnique({
        where: { id: data.followingId },
      });

      if (!followedUser || !followingUser) {
        throw new Error('User not found');
      }

      // Check if the user is already following
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followedId: data.followedId,
          followingId: data.followingId,
        },
      });

      if (existingFollow) {
        throw new Error('Already following this user');
      }

      const follow = await prisma.follow.create({
        data: {
          followedId: data.followedId,
          followingId: data.followingId,
        },
      });
      return follow;
    } catch (error) {
      console.error('Error creating follow in service:', error);
      throw error;
    }
  }

  async deleteFollow(data: DeleteFollowInput) {
    try {
      const result = await prisma.follow.deleteMany({
        where: {
          followedId: data.followedId,
          followingId: data.followingId,
        },
      });

      if (result.count === 0) {
        throw new Error('Follow relationship not found');
      }

      return result;
    } catch (error) {
      console.error('Error deleting follow in service:', error);
      throw error;
    }
  }

  async getFollowers(loggedInUserId: string, userId?: string) {
    try {
      const followsOfUser = await prisma.follow.findMany({
        where: {
          followedId: userId,
        },

        include: {
          following: {
            // Get the user who is following
            select: {
              username: true,
              id: true,
              email: true,
              profile: true,
            },
          },
        },
      });
      // Fetch all users that the loggedInUserId is following
      const followingByLoggedInUser = await prisma.follow.findMany({
        where: {
          followingId: loggedInUserId,
        },
        select: {
          followedId: true,
        },
      });
      // Create a Set for efficient lookup of followed users
      const followedUserIds = new Set(
        followingByLoggedInUser.map((f) => f.followedId),
      );
      const followersWithStatus: FollowerWithFollowingStatus[] =
        followsOfUser.map((follow) => ({
          id: follow.following.id,
          username: follow.following.username,
          email: follow.following.email,
          profile: follow.following.profile,
          isFollowing: followedUserIds.has(follow.following.id),
        }));

      return followersWithStatus;
    } catch (error) {
      console.error('Error fetching followers in service:', error);
      throw error;
    }
  }

  async getFollowing(userId: string) {
    try {
      const follows = await prisma.follow.findMany({
        where: {
          followingId: userId,
        },
        include: {
          followed: {
            // Get the user who is being followed
            select: {
              id: true,
              username: true,
              email: true,
              profile: true,
            },
          },
        },
      });
      // Extract the 'followed' users from the result
      return follows.map((follow) => follow.followed);
    } catch (error) {
      console.error('Error fetching following in service:', error);
      throw error;
    }
  }
}

export default new FollowService();
