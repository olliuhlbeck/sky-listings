import { Request } from 'express';

export interface AuthenticatedRequest<
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {},
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: {
    userId: number;
    username: string;
  };
}
