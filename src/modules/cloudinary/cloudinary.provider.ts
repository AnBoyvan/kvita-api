import { ConfigOptions, v2 } from 'cloudinary';
import { getCloudinaryConfig } from 'src/configs/cloudinary.config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions => {
    const config = getCloudinaryConfig();
    return v2.config(config);
  },
};
