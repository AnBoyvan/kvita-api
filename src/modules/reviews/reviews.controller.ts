import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UserDocument } from 'src/schemas/user.schema';

import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReviewDto, @User() user: UserDocument) {
    return await this.reviewsService.create(user, dto);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @Get()
  async getReviews(@Query() dto: FindReviewsDto) {
    return await this.reviewsService.findReviews(dto);
  }

  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.reviewsService.findById(id);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateReviewDto,
    @User() { _id }: UserDocument,
  ) {
    return await this.reviewsService.update(_id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', IdValidationPipe) id: string,
    @User() { _id: ownerId, role }: UserDocument,
  ) {
    return await this.reviewsService.remove(ownerId, role, id);
  }
}
