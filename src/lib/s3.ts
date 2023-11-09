import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ fileKey: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const fileKey =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: fileKey,
        Body: file,
      };

      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            fileKey,
            fileName: file.name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${fileKey}`;
  return url;
}
