import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ICloudinaryModuleAsyncOptions } from './cloudinary.interfaces';
import { CLOUDINARY } from 'src/constants/cloudinary.constants';
import { ConfigOptions } from 'cloudinary';

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
      provide: CLOUDINARY,
      useFactory: async (...args: any[]): Promise<ConfigOptions> => {
        const config = await options.useFactory(...args);
        return config;
      },
      inject: options.inject || [],
    };
  }
}
