import { UserPayload } from '../../middleware/auth-check.middleware';
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
