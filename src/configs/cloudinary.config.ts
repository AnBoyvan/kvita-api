import { ConfigService } from '@nestjs/config';

export const getCloudinaryConfig = () => {
  const configService = new ConfigService();
  return {
    cloud_name: configService.get('CLOUDINARY_NAME'),
    api_key: configService.get('CLOUDINARY_KEY'),
    api_secret: configService.get('CLOUDINARY_SECRET'),
  };
};
