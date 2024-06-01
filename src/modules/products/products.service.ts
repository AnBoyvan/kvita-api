import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { CONST } from 'src/constants';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { removeTmpFiles } from 'src/utils/removeTmpFiles';

import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IFindProductsFilter } from './products.interfaces';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  async create(
    dto: CreateProductDto,
    files: { image: Express.Multer.File[]; gallery?: Express.Multer.File[] },
  ): Promise<ProductDocument> {
    if (!files.image) {
      throw new BadRequestException(CONST.Product.IMAGE_MISSING_ERROR);
    }

    const newProduct = await this.productModel.create(dto);

    if (!newProduct) {
      throw new InternalServerErrorException();
    }

    const { mainImage, images } = await this.addImages(
      newProduct._id.toString(),
      files.image,
      files.gallery,
    );

    if (mainImage) newProduct.imageURL = mainImage;

    const existedGallery = newProduct.imageGallery
      ? newProduct.imageGallery
      : [];

    newProduct.imageGallery = [...existedGallery, ...images];

    await newProduct.save();

    return newProduct;
  }

  async findProducts(dto: FindProductsDto): Promise<{
    result: ProductDocument[];
    count: number;
    minProductPrice: number;
    maxProductPrice: number;
  }> {
    const {
      search,
      category,
      isActive,
      isNewProduct,
      promo,
      priceMin,
      priceMax,
      createdStart,
      createdEnd,
      updatedStart,
      updatedEnd,
      page = 1,
      limit,
      sortField = 'createdAt',
      sortOrder = 'desc',
    } = dto;

    const filter: IFindProductsFilter = {};
    const pipeline: PipelineStage[] = [];

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      const categoriesArray = category.split(',');
      filter.category = { $in: categoriesArray };
    }

    if (isActive) {
      filter.isActive = isActive === 'true' ? true : false;
    }

    if (isNewProduct) {
      filter.isNewProduct = isNewProduct === 'true' ? true : false;
    }

    if (promo && Number(promo) > 0) {
      filter.promo = { $gte: Number(promo) };
    }

    if (priceMin !== undefined && priceMax !== undefined) {
      filter.$or = [
        {
          $and: [
            { price: { $gte: Number(priceMin) } },
            { price: { $lte: Number(priceMax) } },
          ],
        },
        {
          $and: [
            { promoPrice: { $gte: Number(priceMin) } },
            { promoPrice: { $lte: Number(priceMax) } },
          ],
        },
      ];
    }

    if (createdStart && createdEnd) {
      filter.createdAt = {
        $gte: new Date(createdStart),
        $lte: new Date(createdEnd),
      };
    }

    if (updatedStart && updatedEnd) {
      filter.updatedAt = {
        $gte: new Date(updatedStart),
        $lte: new Date(updatedEnd),
      };
    }

    if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
      if (sortField === 'name') {
        pipeline.push({
          $addFields: {
            lowerCaseName: { $toLower: '$name' },
          },
        });

        pipeline.push({
          $sort: {
            lowerCaseName: sortOrder === 'asc' ? 1 : -1,
          },
        });

        pipeline.push({
          $project: {
            lowerCaseName: 0,
          },
        });
      } else {
        const sortOptions: { [key: string]: 1 | -1 } = {};
        sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
        pipeline.push({ $sort: sortOptions });
      }
    }

    pipeline.push({
      $match: filter,
    });

    if (Number(limit) > 0) {
      const skip = (Number(page) - 1) * Number(limit);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: Number(limit) });
    }

    const count = await this.productModel.countDocuments(filter);
    const result = await this.productModel.aggregate(pipeline);
    const prices = await this.productModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          minPrice: {
            $min: {
              $cond: {
                if: { $gt: ['$promoPrice', 0] },
                then: '$promoPrice',
                else: '$price',
              },
            },
          },
          maxPrice: {
            $max: {
              $cond: {
                if: { $gt: ['$promoPrice', 0] },
                then: '$promoPrice',
                else: '$price',
              },
            },
          },
        },
      },
    ]);
    const minProductPrice = prices.length > 0 ? prices[0].minPrice : 0;
    const maxProductPrice = prices.length > 0 ? prices[0].maxPrice : 0;

    return { result, count, minProductPrice, maxProductPrice };
  }

  async forMain(): Promise<{ [key: string]: ProductDocument[] }> {
    const limit = 5;
    const skip = 0;
    const categories = ['classic', 'cheesecake', 'dessert', 'set', 'other'];

    const getProductsByCategory = async (category: string) => {
      return await this.productModel
        .find({ category })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    };

    const productsByCategories = await Promise.all(
      categories.map(getProductsByCategory),
    );

    const result: { [key: string]: any } = {};
    categories.forEach((category, index) => {
      result[category] = productsByCategories[index];
    });

    return result;
  }

  async findFavorite(_id: Types.ObjectId): Promise<ProductDocument[]> {
    return await this.productModel.find({ favorite: { $in: [_id] } });
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(CONST.Product.NOT_FOUND_ERROR);
    }
    return product;
  }

  async update(
    files: {
      image?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(CONST.Product.NOT_FOUND_ERROR);
    }

    const removeImages = product.imageGallery?.filter(
      img => !dto.imageGallery?.includes(img) && img !== product.imageURL,
    );

    if (removeImages) {
      await this.removeImages(product._id.toString(), removeImages);
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedProduct) {
      throw new NotFoundException(CONST.Product.NOT_FOUND_ERROR);
    }

    const { mainImage, images } = await this.addImages(
      product._id.toString(),
      files.image,
      files.gallery,
    );

    if (mainImage) updatedProduct.imageURL = mainImage;

    const existedGallery = updatedProduct.imageGallery
      ? updatedProduct.imageGallery
      : [];

    updatedProduct.imageGallery = [...existedGallery, ...images];

    await updatedProduct.save();

    if (updatedProduct.imageURL)
      await this.ordersService.updateProductImage(
        updatedProduct._id.toString(),
        updatedProduct.imageURL,
      );

    return updatedProduct;
  }

  async addImages(
    id: string,
    image?: Express.Multer.File[],
    gallery?: Express.Multer.File[],
  ): Promise<{ mainImage: string | undefined; images: string[] }> {
    const images = [];
    let mainImage = undefined;

    const productImage: string | undefined = image && image[0].path;

    const tmpGallery: string[] = gallery
      ? gallery?.map(file => file.path).filter(path => path !== productImage)
      : [];

    const tmpFiles: string[] = [...tmpGallery];

    if (productImage) {
      tmpFiles.push(productImage);

      mainImage = await this.cloudinaryService.addProductImg(productImage, id);

      images.push(mainImage);
    }

    for (const img of tmpGallery) {
      const imgURL = await this.cloudinaryService.addProductImg(img, id);
      images.push(imgURL);
    }

    removeTmpFiles(tmpFiles);

    return { mainImage, images };
  }

  async removeImages(id: string, images: string[]): Promise<void> {
    for (const img of images) {
      const fileName = img.split('/').pop()?.split('.')[0];
      if (fileName) await this.cloudinaryService.removeProductImg(fileName, id);
    }
  }

  async updateFavorite(
    productId: string,
    userId: Types.ObjectId,
  ): Promise<{
    product: ProductDocument;
    message: string;
    userFavorites: string[];
  }> {
    const product = await this.findById(productId);

    const isFavorite =
      product.favorite && product.favorite.includes(userId.toString());
    const updateOperation = isFavorite ? '$pull' : '$addToSet';

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        [updateOperation]: { favorite: userId },
      },
      { new: true },
    );

    if (!updatedProduct) {
      throw new NotFoundException(CONST.Product.NOT_FOUND_ERROR);
    }

    const message = `${product.name} ${isFavorite ? CONST.Product.FAVORITE_REMOVE_SUCCES : CONST.Product.FAVORITE_ADD_SUCCES}`;

    const userFavorites = await this.usersService.updateFavoriteProducts(
      userId,
      productId,
      Boolean(
        updatedProduct.favorite &&
          updatedProduct.favorite.includes(userId.toString()),
      ),
    );

    return { product: updatedProduct, message, userFavorites };
  }

  async remove(id: string): Promise<{ _id: string; message: string }> {
    const product = await this.findById(id);

    await this.cloudinaryService.removeProductFolder(id);

    await this.productModel.findByIdAndDelete(id);

    return {
      _id: id,
      message: `${product.name} ${CONST.Product.REMOVE_SUCCES}`,
    };
  }
}
