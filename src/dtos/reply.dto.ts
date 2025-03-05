import { Reply } from '@prisma/client';
export type CreateReplyDTO = Pick<Reply, 'content'>;
