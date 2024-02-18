import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

import { CreatePictureDto } from './dto/create-picture.dto';
import { FindPicturesDto } from './dto/find-pictures.dto';
import { PicturesService } from './pictures.service';

@ApiTags('pictures')
@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @ApiOperation({ summary: 'Створення зображення' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Post()
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreatePictureDto,
  ) {
    return await this.picturesService.create(image, dto);
  }

  @ApiOperation({ summary: 'Отримання зображень' })
  @Get()
  async getPictures(@Query() dto: FindPicturesDto) {
    return this.picturesService.findPictures(dto);
  }

  @ApiOperation({ summary: 'Отримання зображення за ID' })
  @Get(':id')
  async getPictureById(@Param('id', IdValidationPipe) id: string) {
    return await this.picturesService.findByID(id);
  }

  @ApiOperation({ summary: 'Оновлення зображення' })
  @ApiBearerAuth()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreatePictureDto,
  ) {
    return await this.picturesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Видалення зображення' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return await this.picturesService.remove(id);
  }
}
