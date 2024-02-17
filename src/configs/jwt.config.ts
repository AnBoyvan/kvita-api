import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

interface JwtConfig {
  secret: string;
}

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  const jwtConfig: JwtConfig = {
    secret: configService.get('JWT_SECRET') || '',
  };

  if (!isValidJwtConfig(jwtConfig)) {
    throw new InternalServerErrorException();
  }
  return jwtConfig;
};

const isValidJwtConfig = (config: JwtConfig): boolean => {
  return !!config.secret;
};
