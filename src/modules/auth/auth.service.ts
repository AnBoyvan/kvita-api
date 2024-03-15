import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { CONST } from 'src/constants';
import { UserDocument } from 'src/schemas/user.schema';

import { ExistDto } from './dto/exist.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken';
  EXPIRE_DAY_REFRESH_TOKEN = 1;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async exist(dto: ExistDto): Promise<boolean> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) return true;
    return false;
  }

  async signIn(dto: ExistDto): Promise<{
    user: UserDocument;
    accessToken: string;
  }> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException(CONST.User.LOGIN_BAD_REQUEST_ERROR);
    }

    const id = user?._id.toString();
    const safeUser = await this.usersService.findById(id);
    const accessToken = this.jwtService.sign(
      { id },
      {
        expiresIn: '30d',
      },
    );
    return { user: safeUser, accessToken };
  }

  async register(dto: RegisterDto): Promise<{
    message: string;
  }> {
    const checkEmail = await this.usersService.findByEmail(dto.email);

    if (checkEmail) {
      throw new BadRequestException(CONST.User.ALREADY_REGISTERED_ERROR);
    }

    if (dto.phone) {
      const checkPhone = await this.usersService.findOne(dto.phone);
      if (checkPhone) {
        throw new BadRequestException(CONST.User.ALREADY_REGISTERED_ERROR);
      }
    }

    await this.usersService.create(dto);

    return { message: CONST.User.REGISTER_SUCCESS };
  }

  async login(dto: LoginDto): Promise<{
    user: UserDocument;
    accessToken: string;
  }> {
    const id = await this.validate(dto);

    const safeUser = await this.usersService.findById(id);
    const accessToken = this.jwtService.sign(
      { id },
      {
        expiresIn: '30d',
      },
    );
    return { user: safeUser, accessToken };
  }

  async current(id: string): Promise<UserDocument> {
    return await this.usersService.findById(id);
  }

  private async validate({ login, password }: LoginDto): Promise<string> {
    if (!login) {
      throw new BadRequestException(CONST.User.LOGIN_BAD_REQUEST_ERROR);
    }

    const user = await this.usersService.findOne(login);

    if (!user) {
      throw new BadRequestException(CONST.User.LOGIN_BAD_REQUEST_ERROR);
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(CONST.User.LOGIN_BAD_REQUEST_ERROR);
    }

    const id = user._id.toString();

    return id;
  }
}
