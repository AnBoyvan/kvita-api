import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, PipelineStage, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { IFindUsersFilter } from './user.interfaces';
import { UpdateByUserDto } from './dto/update-by-user.dto';
import { v4 as uuid } from 'uuid';
import {
  ACCESS_ERROR,
  PASSWORD_CHANGE_REQUEST_MESSAGE,
  PASSWORD_CHANGE_SUCCESS,
  REMOVE_USER_SUCCESS,
  USER_NOT_FOUND_ERROR,
} from 'src/constants/user.constants';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import { UpdateByAdminDto } from './dto/update-by-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument | null> {
    const newUser = await this.userModel.create({
      ...dto,
      role: Role.Customer,
    });

    const user = await this.userModel
      .findById(newUser._id)
      .select('-password -verificationToken -passwordToken');

    return user;
  }

  async findAll(
    dto: FindUsersDto,
  ): Promise<{ result: UserDocument[]; count: number } | null> {
    const {
      role,
      phone,
      email,
      verify,
      search,
      minDiscount = 0,
      maxDiscount = 100,
      createdStart,
      createdEnd,
      sortField = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 500,
    } = dto;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: IFindUsersFilter = {};
    const pipeline: PipelineStage[] = [];

    if (role) {
      const rolesArray = role.split(',');
      filter.role = { $in: rolesArray };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (phone) {
      filter.phone = { $regex: phone, $options: 'i' };
    }

    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    if (verify) {
      if (verify === 'true') {
        filter.verify = true;
      } else if (verify === 'false') {
        filter.verify = false;
      }
    }

    if (minDiscount !== undefined && maxDiscount !== undefined) {
      filter.discount = {
        $gte: Number(minDiscount),
        $lte: Number(maxDiscount),
      };
    }

    if (createdStart && createdEnd) {
      filter.createdAt = {
        $gte: new Date(createdStart),
        $lte: new Date(createdEnd),
      };
    }

    if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
      if (sortField === 'name') {
        pipeline.push({
          $addFields: {
            lowerCaseName: { $toLower: '$name' },
          },
        });

        pipeline.push({
          $sort: {
            lowerCaseName: sortOrder === 'asc' ? 1 : -1,
          },
        });

        pipeline.push({
          $project: {
            lowerCaseName: 0,
          },
        });
      } else {
        const sortOptions: { [key: string]: 1 | -1 } = {};
        sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
        pipeline.push({ $sort: sortOptions });
      }
    }
    pipeline.push({
      $match: filter,
    });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });
    pipeline.push({
      $project: {
        password: 0,
        verificationToken: 0,
        passwordToken: 0,
        accessToken: 0,
      },
    });

    const count = await this.userModel.countDocuments(filter);
    const result = await this.userModel.aggregate(pipeline);
    return { result, count };
  }

  async findById(id: string): Promise<UserDocument | null> {
    const user = await this.userModel
      .findById(id)
      .select('-password -verificationToken -passwordToken -accessToken');

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('-password -verificationToken -passwordToken -accessToken');

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({ phone })
      .select('-password -verificationToken -passwordToken -accessToken');

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async updateByUser(
    _id: Types.ObjectId,
    dto: UpdateByUserDto,
  ): Promise<UserDocument | null> {
    const user = await this.userModel
      .findByIdAndUpdate({ _id }, dto, {
        new: true,
      })
      .select('-password -verificationToken -passwordToken');
    return user;
  }

  async changePasswordRequest(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const passwordToken = uuid();
    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { passwordToken },
    });
    await this.emailService.sendPasswordChangeEmail(email, passwordToken);

    return {
      message: PASSWORD_CHANGE_REQUEST_MESSAGE,
    };
  }

  async changePassword(
    passwordToken: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ passwordToken });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: passwordHash,
      passwordToken: null,
    });
    return {
      message: PASSWORD_CHANGE_SUCCESS,
    };
  }

  async updateByAdmin(
    adminRole: string,
    id: Types.ObjectId,
    dto: UpdateByAdminDto,
  ) {
    if (
      dto.role === Role.Manager &&
      adminRole !== Role.Admin &&
      adminRole !== Role.Superuser
    ) {
      throw new ForbiddenException(ACCESS_ERROR);
    }
    if (dto.role === Role.Admin && adminRole !== Role.Superuser) {
      throw new ForbiddenException(ACCESS_ERROR);
    }
    if (dto.role === Role.Superuser) {
      throw new ForbiddenException(ACCESS_ERROR);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .select('-password -verificationToken -passwordToken -accessToken');
    if (!updatedUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return updatedUser;
  }

  async remove(id: Types.ObjectId) {
    const checkUser = await this.userModel.findById(id);
    if (!checkUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    if (checkUser.role === Role.Superuser) {
      throw new ForbiddenException(ACCESS_ERROR);
    }
    const user = await this.userModel
      .findByIdAndDelete(id)
      .select('-password -verificationToken -passwordToken -accessToken');
    return { user, message: REMOVE_USER_SUCCESS };
  }
}
