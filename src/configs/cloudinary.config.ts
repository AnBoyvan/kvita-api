import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';

import { CONST } from 'src/constants';
import { CloudinaryConfig } from 'src/modules/cloudinary/cloudinary.interfaces';

export const getCloudinaryConfig = (
  configService: ConfigService,
): ConfigOptions => {
  const cloudinaryConfig: CloudinaryConfig = {
    cloud_name: configService.get('CLOUDINARY_NAME') || '',
    api_key: configService.get('CLOUDINARY_KEY') || '',
    api_secret: configService.get('CLOUDINARY_SECRET') || '',
  };

  if (!isValidCloudinaryConfig(cloudinaryConfig)) {
    throw new InternalServerErrorException(
      CONST.Cloudinary.AUTHORIZATION_ERROR,
    );
  }

  return v2.config(cloudinaryConfig);
};

const isValidCloudinaryConfig = (config: CloudinaryConfig): boolean => {
  return !!config.cloud_name && !!config.api_key && !!config.api_secret;
};
