import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from 'src/schemas/user.schema';

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
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as UserDocument;

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.authService.logout(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrent(@Req() req: Request) {
    const user = req.user as UserDocument;

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.authService.current(user._id);
  }
}
