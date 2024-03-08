import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ExistDto } from './dto/exist.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
  @Post('exist')
  async register(@Body() dto: ExistDto) {
    return this.authService.exist(dto);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @Post('register')
  async exist(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('access-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refresh(refreshToken);
  }
}
