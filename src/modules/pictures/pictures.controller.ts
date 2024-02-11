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
import { PicturesService } from './pictures.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePictureDto } from './dto/create-picture.dto';
import { FindPicturesDto } from './dto/find-pictures.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreatePictureDto,
  ) {
    return await this.picturesService.create(image, dto);
  }

  @Get()
  async getPictures(@Query() dto: FindPicturesDto) {
    return this.picturesService.findPictures(dto);
  }

  @Get(':id')
  async getPictureById(@Param('id', IdValidationPipe) id: string) {
    return await this.picturesService.findByID(id);
  }

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

  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return await this.picturesService.remove(id);
  }
}
