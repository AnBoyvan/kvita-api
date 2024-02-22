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
import { Types } from 'mongoose';

import { CurrentUser } from 'src/decorators/current-user.decorator';
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
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: UserDocument,
  ) {
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
    @CurrentUser('_id') userId: Types.ObjectId,
  ) {
    return await this.reviewsService.update(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', IdValidationPipe) id: string,
    @CurrentUser() { _id: ownerId, role }: UserDocument,
  ) {
    return await this.reviewsService.remove(ownerId, role, id);
  }
}
