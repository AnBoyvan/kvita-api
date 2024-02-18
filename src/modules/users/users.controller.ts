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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UserDocument } from 'src/schemas/user.schema';

import { ChangePasswordRequestDto } from './dto/change-password-request.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateByAdminDto } from './dto/update-by-admin.dto';
import { UpdateByUserDto } from './dto/update-by-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Отримати користувачів' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get()
  async getUsers(@Query() dto: FindUsersDto) {
    return this.usersService.findAll(dto);
  }

  @ApiOperation({ summary: 'Отримати користувача за ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID користувача' })
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Оновити дані користувачем' })
  @ApiBearerAuth()
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
    @User() { _id }: UserDocument,
  ) {
    return this.usersService.updateByUser(_id, dto);
  }

  @ApiOperation({ summary: 'Запит на зміну пароля' })
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

  @ApiOperation({ summary: 'Змінити пароль' })
  @ApiParam({ name: 'passwordToken', description: 'Токен для зміни паролю' })
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

  @ApiOperation({ summary: 'Оновити дані користувача (адміністратор)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID користувача' })
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
    @User() { role: adminRole }: UserDocument,
  ) {
    return this.usersService.updateByAdmin(adminRole, id, dto);
  }

  @ApiOperation({ summary: 'Видалити користувача' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID користувача' })
  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return this.usersService.remove(id);
  }
}
