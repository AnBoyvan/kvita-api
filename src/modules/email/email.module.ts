import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { MailerOptions } from '@nestjs-modules/mailer';

import { CONST } from 'src/constants';

import { IEmailModuleAsyncOptions } from './email.interfaces';
import { EmailService } from './email.service';

@Global()
@Module({})
export class EmailModule {
  static forRootAsync(options: IEmailModuleAsyncOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options);
    return {
      module: EmailModule,
      imports: options.imports,
      providers: [EmailService, asyncOptions],
      exports: [EmailService],
    };
  }

  private static createAsyncOptionsProvider(
    options: IEmailModuleAsyncOptions,
  ): Provider {
    return {
      provide: CONST.Email.MODULE_OPTIONS,
      useFactory: async (...args: any[]): Promise<MailerOptions> => {
        const config = await options.useFactory(...args);
        return config;
      },
      inject: options.inject || [],
    };
  }
}
