import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';

import { CONST } from 'src/constants';

@Injectable()
export class CloudinaryService {
  async addProductImg(path: string, id: string): Promise<string> {
    const fileName = uuid();

    try {
      const data = await cloudinary.uploader.upload(path, {
        folder: `products/${id}`,
        public_id: fileName,
        overwrite: true,
        format: 'webp',
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: 'fit',
          },
        ],
      });

      if (!data) {
        throw new InternalServerErrorException(CONST.Cloudinary.UPLOAD_ERROR);
      }
      return data.secure_url;
    } catch (error) {
      throw error;
    }
  }

  async removeProductImg(fileName: string, productId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(`products/${productId}/${fileName}`);
    } catch (error) {
      throw error;
    }
  }

  async removeProductFolder(productId: string): Promise<void> {
    try {
      await cloudinary.api.delete_resources_by_prefix(`products/${productId}`);
      await cloudinary.api.delete_folder(`products/${productId}`);
    } catch (error) {
      throw error;
    }
  }

  async addGalleryImg(
    path: string,
  ): Promise<{ imageURL: string; largeImageURL: string }> {
    const fileName = uuid();

    try {
      const imageURL = await cloudinary.uploader.upload(path, {
        folder: `gallery`,
        public_id: fileName,
        overwrite: true,
        format: 'webp',
        transformation: [
          {
            width: 400,
            height: 400,
            crop: 'fit',
          },
        ],
      });
      if (!imageURL) {
        throw new InternalServerErrorException(CONST.Cloudinary.UPLOAD_ERROR);
      }

      const largeImageURL = await cloudinary.uploader.upload(path, {
        folder: `gallery`,
        public_id: `${fileName}_large`,
        overwrite: true,
        format: 'webp',
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: 'fit',
          },
        ],
      });
      if (!largeImageURL) {
        throw new InternalServerErrorException(CONST.Cloudinary.UPLOAD_ERROR);
      }

      return {
        imageURL: imageURL.secure_url,
        largeImageURL: largeImageURL.secure_url,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeGalleryImg(fileName: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(`gallery/${fileName}`);
      await cloudinary.uploader.destroy(`gallery/${fileName}_large`);
    } catch (error) {
      throw error;
    }
  }
}
