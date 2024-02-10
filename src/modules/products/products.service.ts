import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FindProductsDto } from './dto/find-products.dto';
import { IFindProductsFilter } from './products.interfaces';
import { Types } from 'mongoose';
import {
  FAVORITE_ADD_SUCCES,
  FAVORITE_REMOVE_SUCCES,
  IMAGE_MISSING_ERROR,
  IMAGE_NOT_FOUND_ERROR,
  IMAGE_REMOVE_SUCCESS,
  MAIN_IMAGE_REMOVE_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
  PRODUCT_REMOVE_SUCCES,
} from 'src/constants/product.constants';
import { removeTmpFiles } from 'src/utils/removeTmpFiles';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateProductDto,
    files: { image: Express.Multer.File[]; gallery?: Express.Multer.File[] },
  ): Promise<ProductDocument | null> {
    if (!files.image) {
      throw new BadRequestException(IMAGE_MISSING_ERROR);
    }

    const productImage: string = files.image[0].path;
    const tmpGallery: string[] = files.gallery
      ? files.gallery?.map(file => file.path)
      : [];

    const tmpFiles: string[] = [files.image[0].path, ...tmpGallery];

    const newProduct = await this.productModel.create(dto);

    const imageGallery = [];

    const imageURL = await this.cloudinaryService.addProductImg(
      productImage,
      newProduct._id.toString(),
      newProduct.category,
    );

    imageGallery.push(imageURL);

    for (const img of tmpGallery) {
      const imgURL = await this.cloudinaryService.addProductImg(
        img,
        newProduct._id.toString(),
        newProduct.category,
      );
      imageGallery.push(imgURL);
    }

    const createdProduct = await this.productModel.findByIdAndUpdate(
      newProduct._id,
      { imageURL, imageGallery },
      {
        new: true,
      },
    );

    removeTmpFiles(tmpFiles);

    if (!createdProduct) {
      return null;
    }

    return createdProduct;
  }

  async findProducts(
    dto: FindProductsDto,
  ): Promise<{ result: ProductDocument[]; count: number }> {
    const {
      search,
      category,
      isActive,
      isNewProduct,
      createdStart,
      createdEnd,
      updatedStart,
      updatedEnd,
      page = 1,
      limit = 16,
      sortField = 'createdAt',
      sortOrder = 'desc',
    } = dto;

    const skip = (Number(page) - 1) * Number(limit);
    const filter: IFindProductsFilter = {};
    const pipeline: PipelineStage[] = [];

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: 'i' } }];
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
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });

    const count = await this.productModel.countDocuments(filter);
    const result = await this.productModel.aggregate(pipeline);
    return { result, count };
  }

  async forMain(): Promise<{ [key: string]: ProductDocument[] }> {
    const limit = 4;
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

  async findById(id: string): Promise<ProductDocument | null> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
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
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

    const newImages = [];
    const tmpFiles: string[] = [];
    const galleryPaths: string[] = files.gallery
      ? files.gallery.map(file => file.path)
      : [];
    const filteredGallery: string[] = galleryPaths.filter(
      path => !files?.image || path !== files?.image[0].path,
    );
    if (files.image && files.image[0]) {
      tmpFiles.push(files.image[0].path);
    }
    tmpFiles.push(...filteredGallery);

    if (files.image) {
      const newImageURL = await this.cloudinaryService.addProductImg(
        files.image[0].path,
        updatedProduct._id.toString(),
        updatedProduct.category,
      );
      newImages.push(newImageURL);
      updatedProduct.imageURL = newImageURL;
    }

    for (const img of filteredGallery) {
      const imgURL = await this.cloudinaryService.addProductImg(
        img,
        updatedProduct._id.toString(),
        updatedProduct.category,
      );
      newImages.push(imgURL);
    }

    if (updatedProduct.imageGallery === undefined) {
      updatedProduct.imageGallery = [];
    }
    updatedProduct.imageGallery = [
      ...updatedProduct.imageGallery,
      ...newImages,
    ];
    await updatedProduct.save();

    removeTmpFiles(tmpFiles);
    return updatedProduct;
  }

  async removeGalleryImage(
    id: string,
    image: string,
  ): Promise<{ image: string; message: string }> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    if (image === product.imageURL) {
      throw new ForbiddenException(MAIN_IMAGE_REMOVE_ERROR);
    }

    if (!image || !product.imageGallery?.includes(image)) {
      throw new NotFoundException(IMAGE_NOT_FOUND_ERROR);
    }

    const fileName = image.split('/').pop()?.split('.')[0];

    if (!fileName || !product.imageURL) {
      throw new InternalServerErrorException();
    }

    await this.cloudinaryService.removeProductImg(
      fileName,
      id,
      product.category,
    );

    const imgIndex = product.imageGallery.indexOf(image);
    if (imgIndex === -1) {
      throw new NotFoundException(IMAGE_NOT_FOUND_ERROR);
    }
    product.imageGallery.splice(imgIndex, 1);
    await product.save();

    return { image, message: IMAGE_REMOVE_SUCCESS };
  }

  async updateFavorite(
    id: string,
    user: UserDocument,
  ): Promise<{ product: ProductDocument; message: string }> {
    const userId = user._id.toString();
    let message: string;
    let updatedProduct: ProductDocument | null;
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

    if (product.favorite && product.favorite.includes(userId)) {
      updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        {
          $pull: { favorite: userId },
        },
        { new: true },
      );
      message = `${product.name} ${FAVORITE_REMOVE_SUCCES}`;
    } else {
      updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { favorite: userId },
        },
        { new: true },
      );
      message = `${product.name} ${FAVORITE_ADD_SUCCES}`;
    }

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

    return { product: updatedProduct, message };
  }

  async remove(id: string): Promise<{ _id: string; message: string }> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

    await this.cloudinaryService.removeProductFolder(id, product.category);

    await this.productModel.findByIdAndDelete(id);

    return {
      _id: id,
      message: `${product.name} ${PRODUCT_REMOVE_SUCCES}`,
    };
  }
}
