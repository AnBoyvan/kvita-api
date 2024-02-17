import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigOptions } from 'cloudinary';

import { CONST } from 'src/constants';

import { ICloudinaryModuleAsyncOptions } from './cloudinary.interfaces';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({})
export class CloudinaryModule {
  static forRootAsync(options: ICloudinaryModuleAsyncOptions): DynamicModule {
    const cloudinaryOptionsAsyncProvider = this.createOptionsProvider(options);
    return {
      module: CloudinaryModule,
      imports: options.imports,
      providers: [CloudinaryService, cloudinaryOptionsAsyncProvider],
      exports: [CloudinaryService, cloudinaryOptionsAsyncProvider],
    };
  }

  private static createOptionsProvider(
    options: ICloudinaryModuleAsyncOptions,
  ): Provider {
    return {
      provide: CONST.Cloudinary.MODULE_OPTIONS,
      useFactory: async (...args: any[]): Promise<ConfigOptions> => {
        const config = await options.useFactory(...args);
        return config;
      },
      inject: options.inject || [],
    };
  }
}
