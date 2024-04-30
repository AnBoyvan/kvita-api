import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CONST } from 'src/constants';
import { ProductsService } from 'src/modules/products/products.service';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { UserDocument } from 'src/schemas/user.schema';

import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { IFindReviewsFilter } from './reviews.interfaces';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    user: UserDocument,
    dto: CreateReviewDto,
  ): Promise<ReviewDocument> {
    const { _id: ownerId, name: ownerName } = user;

    await this.productsService.findById(dto.productId);

    return await this.reviewModel.create({
      ...dto,
      ownerId,
      ownerName,
    });
  }

  async findReviews(dto: FindReviewsDto): Promise<ReviewDocument[]> {
    const { productId, ownerId } = dto;
    const filter: IFindReviewsFilter = {};

    if (productId) {
      filter.productId = { $regex: productId, $options: 'i' };
    }

    if (ownerId) {
      filter.ownerId = { $regex: ownerId, $options: 'i' };
    }

    return await this.reviewModel.find(filter).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException(CONST.Review.NOT_FOUND_ERROR);
    }
    return review;
  }

  async update(
    userId: Types.ObjectId,
    id: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    const review = await this.findById(id);

    const { ownerId } = review;

    if (ownerId !== userId.toString()) {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedReview) {
      throw new NotFoundException(CONST.Review.NOT_FOUND_ERROR);
    }

    return updatedReview;
  }

  async remove(
    userId: Types.ObjectId,
    role: string,
    id: string,
  ): Promise<{ _id: string; message: string }> {
    const review = await this.findById(id);

    const { ownerId } = review;
    if (ownerId !== userId.toString() && role !== 'superuser') {
      throw new ForbiddenException(CONST.User.ACCESS_ERROR);
    }

    const deletedReview = await this.reviewModel.findByIdAndDelete(id);

    if (!deletedReview) {
      throw new NotFoundException(CONST.Review.NOT_FOUND_ERROR);
    }

    return {
      _id: id,
      message: CONST.Review.REMOVE_SUCCESS,
    };
  }
}
