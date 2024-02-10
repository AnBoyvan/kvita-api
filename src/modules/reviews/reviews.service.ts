import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { UserDocument } from 'src/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { format } from 'date-fns';
import { ProductsService } from '../products/products.service';
import { FindReviewsDto } from './dto/find-reviews.dto copy';
import { IFindReviewsFilter } from './reviews.interfaces';
import {
  REVIEW_NOT_FOUND_ERROR,
  REVIEW_REMOVE_SUCCES,
} from 'src/constants/review.constants';
import { PRODUCT_NOT_FOUND_ERROR } from 'src/constants/product.constants';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ACCESS_ERROR } from 'src/constants/user.constants';

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
  ): Promise<ReviewDocument | null> {
    const { _id: ownerId, name: ownerName } = user;

    const product = await this.productsService.findById(dto.productId);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    const date = format(new Date(), 'dd-MM-yyyy');

    return await this.reviewModel.create({
      ...dto,
      ownerId,
      ownerName,
      date,
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

  async findById(id: string): Promise<ReviewDocument | null> {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }
    return review;
  }

  async update(
    userId: Types.ObjectId,
    id: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }

    const { ownerId } = review;

    if (ownerId !== userId.toString()) {
      throw new ForbiddenException(ACCESS_ERROR);
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedReview) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }

    return updatedReview;
  }

  async remove(
    userId: Types.ObjectId,
    role: string,
    id: string,
  ): Promise<{ _id: string; message: string }> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }

    const { ownerId } = review;
    if (ownerId !== userId.toString() && role !== 'superuser') {
      throw new ForbiddenException(ACCESS_ERROR);
    }

    const deletedReview = await this.reviewModel.findByIdAndDelete(id);

    if (!deletedReview) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }

    return {
      _id: id,
      message: REVIEW_REMOVE_SUCCES,
    };
  }
}
