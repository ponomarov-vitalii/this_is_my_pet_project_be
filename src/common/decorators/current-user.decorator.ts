import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserPayload {
  userId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request: { user: AuthUserPayload } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
