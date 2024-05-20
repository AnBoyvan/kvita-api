import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { Role } from 'src/schemas/user.schema';

import { ChangePasswordRequestDto } from './dto/change-password-request.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateByAdminDto } from './dto/update-by-admin.dto';
import { UpdateByUserDto } from './dto/update-by-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get()
  async getUsers(@Query() dto: FindUsersDto) {
    return this.usersService.findAll(dto);
  }

  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.findById(id);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateByUser(
    @Body() dto: UpdateByUserDto,
    @CurrentUser('_id') _id: Types.ObjectId,
  ) {
    return this.usersService.updateByUser(_id, dto);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser('_id') _id: Types.ObjectId,
  ) {
    return this.usersService.updatePassword(_id, dto);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Patch('password')
  async changePasswordRequest(@Body() { email }: ChangePasswordRequestDto) {
    return this.usersService.changePasswordRequest(email);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Patch('password/:passwordToken')
  async changePassword(
    @Param('passwordToken') passwordToken: string,
    @Body() { password }: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(passwordToken, password);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Patch(':id')
  async updateByAdmin(
    @Param('id', IdValidationPipe) id: Types.ObjectId,
    @Body() dto: UpdateByAdminDto,
    @CurrentUser('role') adminRole: Role,
  ) {
    return this.usersService.updateByAdmin(adminRole, id, dto);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Delete('own-remove')
  async removeOwn(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser('_id') _id: Types.ObjectId,
  ) {
    return this.usersService.removeOwn(_id, dto);
  }

  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.remove(id);
  }
}
