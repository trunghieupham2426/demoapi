import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const editFileName = (req: Request, file, cb) => {
  // @ts-ignore
  cb(null, `user-${req.user.id}-avatar.jpeg`);
};

export const multerFilter = (req: Request, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException('Not an image! Please upload only images'),
      false,
    );
  }
};
