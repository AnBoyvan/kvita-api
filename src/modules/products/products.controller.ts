import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: { image: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    @Body()
    dto: CreateProductDto,
  ) {
    return await this.productsService.create(dto, files);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @Get()
  async getProducts(@Query() dto: FindProductsDto) {
    return await this.productsService.findProducts(dto);
  }

  @Get('main')
  async getForMain() {
    return await this.productsService.forMain();
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorite')
  async getFavorite(@CurrentUser('_id') _id: Types.ObjectId) {
    return await this.productsService.findFavorite(_id);
  }

  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.productsService.findById(id);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
  )
  async update(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    @Param('id', IdValidationPipe) id: string,
    @Body()
    dto: UpdateProductDto,
  ) {
    return await this.productsService.update(files, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/favorite')
  async updateFaforite(
    @Param('id', IdValidationPipe) id: string,
    @CurrentUser('_id') userId: Types.ObjectId,
  ) {
    return await this.productsService.updateFavorite(id, userId);
  }

  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return await this.productsService.remove(id);
  }
}
