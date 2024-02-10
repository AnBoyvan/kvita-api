import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ManagerAccessGuard } from 'src/guards/manager-access.guard';
import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { RemoveGalleryImageDto } from './dto/remove-gallery-image.dto';
import { SuperuserAccessGuard } from 'src/guards/superuser-access.guard';

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
  async getFavorite(@Req() req: Request) {
    const { _id } = req.user as UserDocument;
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

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard, ManagerAccessGuard)
  @Patch(':id/delete')
  async removeGalleryImage(
    @Param('id', IdValidationPipe) id: string,
    @Body() { image }: RemoveGalleryImageDto,
  ) {
    return await this.productsService.removeGalleryImage(id, image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/favorite')
  async updateFaforite(
    @Param('id', IdValidationPipe) id: string,
    @Req() req: Request,
  ) {
    const user = req.user as UserDocument;
    return await this.productsService.updateFavorite(id, user);
  }

  @UseGuards(JwtAuthGuard, SuperuserAccessGuard)
  @Delete(':id')
  async remove(@Param('id', IdValidationPipe) id: string) {
    return await this.productsService.remove(id);
  }
}
