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

  async signIn(dto: ExistDto): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(dto.email);
    return user;
  }

  async register(dto: RegisterDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const checkEmail = await this.usersService.findByEmail(dto.email);

    if (checkEmail) {
      throw new BadRequestException(CONST.User.ALREADY_REGISTERED_ERROR);
    }

    const user = await this.usersService.create(dto);
    const tokens = this.issueTokens(user._id.toString());
    return { user, ...tokens };
  }

  async login(dto: LoginDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const id = await this.validate(dto);

    const safeUser = await this.usersService.findById(id);

    const tokens = this.issueTokens(id);
    return { user: safeUser, ...tokens };
  }

  private issueTokens(_id: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const data = { id: _id.toString() };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
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

  async refresh(refreshToken: string): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) {
      throw new UnauthorizedException(CONST.User.REFRESH_TOKEN_INVALID_ERROR);
    }

    const safeUser = await this.usersService.findById(result.id);

    const tokens = this.issueTokens(result.id);

    return { user: safeUser, ...tokens };
  }
}
