import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CONST } from 'src/constants';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...data } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return data;
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...data } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return data;
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenToResponse(res);
    return true;
  }

  @HttpCode(200)
  @Post('access-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const requestRefreshToken =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!requestRefreshToken) {
      this.authService.removeRefreshTokenToResponse(res);
      throw new UnauthorizedException(CONST.User.REFRESH_TOKEN_MISSING_ERROR);
    }

    const { refreshToken, ...response } =
      await this.authService.refresh(requestRefreshToken);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }
}
