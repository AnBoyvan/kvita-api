import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import {
  ALREADY_REGISTERED_ERROR,
  LOGIN_BAD_REQUEST_ERROR,
} from 'src/constants/user.constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto): Promise<UserDocument | null> {
    const checkEmail = await this.usersService.findByEmail(dto.email);
    const checkPhone = await this.usersService.findByPhone(dto.phone);
    if (checkEmail || checkPhone) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);
    const accessToken = await this.jwtService.signAsync(dto.email);
    const newUser = { ...dto, password: passwordHash, accessToken };

    return this.usersService.create(newUser);
  }

  async validate({
    email,
    phone,
    password,
  }: LoginDto): Promise<Types.ObjectId> {
    let user;

    if (!email && !phone) {
      throw new UnauthorizedException(LOGIN_BAD_REQUEST_ERROR);
    } else if (email) {
      user = await this.userModel.findOne({ email });
    } else {
      user = await this.userModel.findOne({ phone });
    }

    if (!user) {
      throw new UnauthorizedException(LOGIN_BAD_REQUEST_ERROR);
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(LOGIN_BAD_REQUEST_ERROR);
    }

    return user._id;
  }

  async login(dto: LoginDto): Promise<UserDocument | null> {
    const id = await this.validate(dto);
    const accessToken = this.jwtService.sign({ id });

    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { accessToken },
        {
          new: true,
        },
      )
      .select('-password -verificationToken -passwordToken');

    return user;
  }

  async logout(id: Types.ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { accessToken: '' }).exec();

    return;
  }

  async current(id: Types.ObjectId): Promise<UserDocument | null> {
    const user = await this.userModel
      .findById(id)
      .select('-password -verificationToken -passwordToken');

    return user;
  }
}
