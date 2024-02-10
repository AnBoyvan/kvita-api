import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { path } from 'app-root-path';
import { diskStorage } from 'multer';
import { IMAGE_MIMETIPE_ERROR } from 'src/constants/multer.constants';

export const getMulterConfigForImages = (): MulterModuleOptions => ({
  storage: diskStorage({
    destination: `${path}/tmp`,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
    } else {
      cb(
        new HttpException(IMAGE_MIMETIPE_ERROR, HttpStatus.BAD_REQUEST),
        false,
      );
    }
  },
});
