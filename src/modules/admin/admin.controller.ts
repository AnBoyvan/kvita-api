import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Post()
  async create(@Body() dto: CreateAdminDto) {
    return await this.adminService.create(dto);
  }

  @Get('tags')
  async getTags() {
    return await this.adminService.getTags();
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Patch('add-tags')
  async addTags(@Body() dto: UpdateTagsDto) {
    return await this.adminService.addTags(dto);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Patch('remove-tags')
  async removeTags(@Body() dto: UpdateTagsDto) {
    return await this.adminService.removeTags(dto);
  }
}
