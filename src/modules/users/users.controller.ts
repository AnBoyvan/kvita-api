import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUsersDto } from './dto/find-users.dto';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UserDocument } from 'src/schemas/user.schema';
import { Request } from 'express';
import { UpdateByUserDto } from './dto/update-by-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateByAdminDto } from './dto/update-by-admin.dto';
import { Types } from 'mongoose';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get()
  async getAll(@Query() dto: FindUsersDto) {
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
  async updateByUser(@Req() req: Request, @Body() dto: UpdateByUserDto) {
    const { _id } = req.user as UserDocument;
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return this.usersService.updateByUser(_id, dto);
  }

  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  @Patch('password')
  async changePasswordRequest(@Body('email') email: string) {
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
    @Req() req: Request,
    @Body() dto: UpdateByAdminDto,
  ) {
    const { role: adminRole } = req.user as UserDocument;
    return this.usersService.updateByAdmin(adminRole, id, dto);
  }

  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: Types.ObjectId) {
    return this.usersService.remove(id);
  }
}
