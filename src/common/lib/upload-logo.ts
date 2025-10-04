import { PutObjectCommand } from '@aws-sdk/client-s3';
import S3 from './s3';
import { BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import { randomUUID } from 'crypto';

export async function uploadLogo(
  logo: Express.Multer.File | undefined,
): Promise<string | undefined> {
  if (logo) {
    if (logo.size > 2 * 1024 * 1024) {
      throw new BadRequestException({
        message: 'El archivo excede los 2MB',
        errors: { logo: 'El archivo excede los 2MB' },
      });
    }

    // 🔹 Optimización en backend (resize + webp si no es SVG)
    let buffer: Buffer;

    if (logo.mimetype === 'image/svg+xml') {
      buffer = logo.buffer; // no transformamos SVG
    } else {
      buffer = await sharp(logo.buffer)
        .resize({ width: 500 })
        .webp({ quality: 80 })
        .toBuffer();
    }

    const fileName = `${randomUUID()}.webp`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType:
        logo.mimetype === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp',
    });

    await S3.send(putObjectCommand);

    return `${process.env.DOMAIN_BASE_URL}/${fileName}`;
  }

  return undefined;
}
