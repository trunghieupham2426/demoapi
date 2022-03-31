import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload(
        file.path,
        {
          public_id: file.filename, // define filename
          folder: 'DEV',
        },
        function (error, result) {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
