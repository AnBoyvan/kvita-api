import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Model, ModifyResult, PipelineStage, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CONST } from 'src/constants';
import { Role, User, UserDocument } from 'src/schemas/user.schema';

import { FindUsersDto } from './dto/find-users.dto';
import { UpdateByAdminDto } from './dto/update-by-admin.dto';
import { UpdateByUserDto } from './dto/update-by-user.dto';
import { IFindUsersFilter } from './user.interfaces';
import { RegisterDto } from '../auth/dto/register.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  private HIDE_OPTIONS = '-password -verificationToken -passwordToken';

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: RegisterDto): Promise<UserDocument> {
    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);

    const newUser = await this.userModel.create({
      ...dto,
      password: passwordHash,
      role: Role.Customer,
    });

    const safeUser = this.findById(newUser._id.toString());

    if (!safeUser) {
      throw new InternalServerErrorException();
    }

    return safeUser;
  }

  async findOne(search: string): Promise<UserDocument | null> {
    const query = {
      $or: [{ email: search }, { phone: search }],
    };

    return await this.userModel.findOne(query);
  }

  async findAll(
    dto: FindUsersDto,
  ): Promise<{ result: UserDocument[]; count: number }> {
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
      },
    });

    const count = await this.userModel.countDocuments(filter);
    const result = await this.userModel.aggregate(pipeline);

    return { result, count };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .select(this.HIDE_OPTIONS)
      .exec();

    if (!user) {
      throw new NotFoundException(CONST.User.NOT_FOUND_ERROR);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ phone }).exec();
  }

  async updateByUser(
    _id: Types.ObjectId,
    dto: UpdateByUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate({ _id }, dto, {
        new: true,
      })
      .select(this.HIDE_OPTIONS);

    if (!user) {
      throw new NotFoundException(CONST.User.NOT_FOUND_ERROR);
    }

    return user;
  }

  async changePasswordRequest(email: string): Promise<{ message: string }> {
    const user = await this.findByEmail(email);

    const passwordToken = uuid();

    if (!user) {
      throw new NotFoundException(CONST.User.NOT_FOUND_ERROR);
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { passwordToken },
    });
    await this.emailService.sendPasswordChangeEmail(email, passwordToken);

    return {
      message: CONST.User.PASSWORD_CHANGE_REQUEST_MESSAGE,
    };
  }

  async changePassword(
    passwordToken: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ passwordToken });
    if (!user) {
      throw new NotFoundException(CONST.User.NOT_FOUND_ERROR);
    }
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: passwordHash,
      passwordToken: null,
    });
    return {
      message: CONST.User.PASSWORD_CHANGE_SUCCESS,
    };
  }

  async updateByAdmin(
    adminRole: string,
    id: Types.ObjectId,
    dto: UpdateByAdminDto,
  ): Promise<UserDocument> {
    if (
      dto.role === Role.Manager &&
      adminRole !== Role.Admin &&
      adminRole !== Role.Superuser
    ) {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }
    if (dto.role === Role.Admin && adminRole !== Role.Superuser) {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }
    if (dto.role === Role.Superuser) {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .select(this.HIDE_OPTIONS);
    if (!updatedUser) {
      throw new NotFoundException(CONST.User.NOT_FOUND_ERROR);
    }
    return updatedUser;
  }

  async remove(
    id: string,
  ): Promise<{ user: ModifyResult<UserDocument>; message: string }> {
    const checkUser = await this.findById(id);

    if (checkUser.role === Role.Superuser) {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }
    const user = await this.userModel
      .findByIdAndDelete(id)
      .select(this.HIDE_OPTIONS);
    if (!user) {
      throw new NotFoundException(CONST.User.NOT_FOUND_ERROR);
    }
    return { user, message: CONST.User.REMOVE_SUCCESS };
  }
}
