import { Request } from 'express';

export interface UserIdRequest<
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {},
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  userId?: number;
}
