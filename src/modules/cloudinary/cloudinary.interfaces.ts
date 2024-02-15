import { ModuleMetadata } from '@nestjs/common';
import { ConfigOptions } from 'cloudinary';

export interface ICloudinaryModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ConfigOptions> | ConfigOptions;
  inject?: any[];
}
