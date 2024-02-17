import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserDocument } from 'src/schemas/user.schema';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
