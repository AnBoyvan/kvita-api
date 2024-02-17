import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CONST } from 'src/constants';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { Picture, PictureDocument } from 'src/schemas/picture.schema';
import { removeTmpFiles } from 'src/utils/removeTmpFiles';

import { CreatePictureDto } from './dto/create-picture.dto';
import { FindPicturesDto } from './dto/find-pictures.dto';
import { IFindPicturesFilter } from './pictures.interfaces';

@Injectable()
export class PicturesService {
  constructor(
    @InjectModel(Picture.name)
    private readonly pictureModel: Model<PictureDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    image: Express.Multer.File,
    dto: CreatePictureDto,
  ): Promise<PictureDocument> {
    if (!image) {
      throw new BadRequestException(CONST.Picture.IMAGE_MISSING_ERROR);
    }

    const { imageURL, largeImageURL } =
      await this.cloudinaryService.addGalleryImg(image.path);

    const newPicture = await this.pictureModel.create({
      imageURL,
      largeImageURL,
      ...dto,
    });

    removeTmpFiles([image.path]);

    return newPicture;
  }

  async findPictures(dto: FindPicturesDto): Promise<PictureDocument[]> {
    const { tags, page = 1, limit = 20 } = dto;
    const skip = (Number(page) - 1) * Number(limit);
    const filter: IFindPicturesFilter = {};

    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }

    return await this.pictureModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  async findByID(id: string): Promise<PictureDocument> {
    const picture = await this.pictureModel.findById(id);

    if (!picture) {
      throw new NotFoundException(CONST.Picture.NOT_FOUND_ERROR);
    }

    return picture;
  }

  async update(id: string, dto: CreatePictureDto): Promise<PictureDocument> {
    const updatedPicture = await this.pictureModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedPicture) {
      throw new NotFoundException(CONST.Picture.NOT_FOUND_ERROR);
    }

    return updatedPicture;
  }

  async remove(id: string): Promise<{ _id: string; message: string }> {
    const picture = await this.pictureModel.findById(id);

    if (!picture) {
      throw new NotFoundException(CONST.Picture.NOT_FOUND_ERROR);
    }

    const fileName = picture.imageURL.split('/').pop()?.split('.')[0];

    if (!fileName || !picture.imageURL) {
      throw new InternalServerErrorException();
    }

    await this.cloudinaryService.removeGalleryImg(fileName);

    await this.pictureModel.findByIdAndDelete(id);

    return {
      _id: id,
      message: CONST.Picture.REMOVE_SUCCES,
    };
  }
}
