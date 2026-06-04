import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.BUCKET_NAME || "demo-resultados";

function createS3Client(): S3Client {
  const config: S3ClientConfig = {
    region: process.env.AWS_REGION || "us-east-1",
  };

  const isLocal =
    process.env.AWS_ENDPOINT_URL || !process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (isLocal) {
    config.endpoint =
      process.env.AWS_ENDPOINT_URL || "http://127.0.0.1:4566";
    config.forcePathStyle = true;
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
    };
  }

  return new S3Client(config);
}

const s3 = createS3Client();

export const handler = async (event: { body?: string }) => {
  const body = JSON.parse(event.body || "{}");
  const texto: string = body.texto || "";

  const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const caracteres = texto.length;
  const fecha = new Date().toISOString();

  const resultado = {
    texto,
    palabras,
    caracteres,
    fecha,
  };

  const key = `resultados/${Date.now()}.json`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(resultado),
      ContentType: "application/json",
    })
  );

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(resultado),
  };
};
