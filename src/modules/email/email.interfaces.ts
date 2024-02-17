import { ModuleMetadata } from '@nestjs/common';
import { MailerOptions } from '@nestjs-modules/mailer';

export interface IEmailModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<MailerOptions> | MailerOptions;
  inject?: any[];
}

export interface IEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface ISendEmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}
