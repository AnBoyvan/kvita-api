import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CloudinaryService {
  async addProductImg(
    path: string,
    id: string,
    category: string,
  ): Promise<string> {
    const fileName = uuid();
    const data = await cloudinary.uploader.upload(path, {
      folder: `products/${category}/${id}`,
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
      throw new Error(data);
    }
    return data.secure_url;
  }

  async removeProductImg(
    fileName: string,
    productId: string,
    category: string,
  ): Promise<void> {
    try {
      await cloudinary.uploader.destroy(
        `products/${category}/${productId}/${fileName}`,
      );
    } catch (error) {
      throw error;
    }
  }

  async removeProductFolder(
    productId: string,
    category: string,
  ): Promise<void> {
    try {
      await cloudinary.api.delete_resources_by_prefix(
        `products/${category}/${productId}`,
      );
      await cloudinary.api.delete_folder(`products/${category}/${productId}`);
    } catch (error) {
      throw error;
    }
  }

  async addGalleryImg(
    path: string,
  ): Promise<{ imageURL: string; largeImageURL: string }> {
    const fileName = uuid();
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
      throw new Error(imageURL);
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
      throw new Error(largeImageURL);
    }

    return {
      imageURL: imageURL.secure_url,
      largeImageURL: largeImageURL.secure_url,
    };
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
