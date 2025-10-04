import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import S3 from './s3';

export async function deleteLogo(logo_url: string | null) {
  if (!logo_url) return;

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: logo_url.replace(`${process.env.DOMAIN_BASE_URL}/`, ''),
  });

  await S3.send(deleteObjectCommand);
}
