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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto copy';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UpdateReviewDto } from './dto/update-review.dto';

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
  async create(@Req() req: Request, @Body() dto: CreateReviewDto) {
    const user = req.user as UserDocument;
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
    @Req() req: Request,
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const user = req.user as UserDocument;
    return await this.reviewsService.update(user._id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id', IdValidationPipe) id: string) {
    const { _id: ownerId, role } = req.user as UserDocument;
    return await this.reviewsService.remove(ownerId, role, id);
  }
}
