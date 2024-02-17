import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const mongoConfig: MongooseModuleOptions = {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };

  if (!isValidMongoConfig(mongoConfig)) {
    throw new InternalServerErrorException();
  }

  return mongoConfig;
};

const getMongoString = (configService: ConfigService) =>
  'mongodb+srv://' +
  configService.get('MONGO_LOGIN') +
  ':' +
  configService.get('MONGO_PASSWORD') +
  '@' +
  configService.get('MONGO_HOST') +
  '/' +
  configService.get('MONGO_DB_NAME') +
  '?' +
  configService.get('MONGO_CONNECTION_OPTIONS');

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const isValidMongoConfig = (config: MongooseModuleOptions): boolean => {
  return !!config.uri;
};
