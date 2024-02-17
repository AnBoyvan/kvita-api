import { ModuleMetadata } from '@nestjs/common';
import { ConfigOptions } from 'cloudinary';

export interface ICloudinaryModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ConfigOptions> | ConfigOptions;
  inject?: any[];
}

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}
