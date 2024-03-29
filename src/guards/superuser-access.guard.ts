import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';

import { CONST } from 'src/constants';
import { Role } from 'src/schemas/user.schema';

@Injectable()
export class SuperuserAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { role } = request.user;

    try {
      if (role === Role.Superuser) {
        return true;
      }
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    } catch (error) {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }
  }
}
