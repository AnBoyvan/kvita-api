import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import {
  ADMIN_ALREADY_EXIST_ERROR,
  ADMIN_NOT_FOUND_ERROR,
} from 'src/constants/admin.constants';
import { UpdateTagsDto } from './dto/update-tags.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {}

  async create(dto: CreateAdminDto): Promise<AdminDocument> {
    const existed = await this.adminModel.findOne({ name: dto.name });

    if (existed) {
      throw new BadRequestException(ADMIN_ALREADY_EXIST_ERROR);
    }
    return await this.adminModel.create(dto);
  }

  async getTags(): Promise<string[]> {
    const config = await this.adminModel.findOne({
      name: 'config',
    });

    if (!config) {
      throw new InternalServerErrorException(ADMIN_NOT_FOUND_ERROR);
    }

    return config.tags;
  }

  async addTags(dto: UpdateTagsDto): Promise<string[]> {
    const config = await this.adminModel.findOne({
      name: 'config',
    });

    if (!config) {
      throw new InternalServerErrorException(ADMIN_NOT_FOUND_ERROR);
    }

    const newTags = dto.tags.filter(tag => !config.tags.includes(tag));
    const updatedTags = [...config.tags, ...newTags];

    const updatedConfig = await this.adminModel.findByIdAndUpdate(
      config._id,
      {
        $set: { tags: updatedTags },
      },
      { new: true },
    );
    if (!updatedConfig) {
      throw new InternalServerErrorException(ADMIN_NOT_FOUND_ERROR);
    }

    return updatedConfig.tags;
  }

  async removeTags(dto: UpdateTagsDto): Promise<string[]> {
    const config = await this.adminModel.findOne({
      name: 'config',
    });

    if (!config) {
      throw new InternalServerErrorException(ADMIN_NOT_FOUND_ERROR);
    }

    const updatedTags = config.tags.filter(tag => !dto.tags.includes(tag));
    const updatedConfig = await this.adminModel.findByIdAndUpdate(
      config._id,
      {
        $set: { tags: updatedTags },
      },
      { new: true },
    );

    if (!updatedConfig) {
      throw new InternalServerErrorException(ADMIN_NOT_FOUND_ERROR);
    }

    return updatedConfig.tags;
  }
}
