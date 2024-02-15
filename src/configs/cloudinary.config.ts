import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY_AUTHORIZATION_ERROR } from 'src/constants/cloudinary.constants';

export const getCloudinaryConfig = (
  configService: ConfigService,
): ConfigOptions => {
  const cloud_name = configService.get('CLOUDINARY_NAME');
  const api_key = configService.get('CLOUDINARY_KEY');
  const api_secret = configService.get('CLOUDINARY_SECRET');

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(CLOUDINARY_AUTHORIZATION_ERROR);
  }

  return v2.config({
    cloud_name,
    api_key,
    api_secret,
  });
};
