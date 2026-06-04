import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const BUCKET_NAME = "demo-resultados";

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || "{}");
  const texto: string = body.texto || "";

  // Procesamiento simple
  const palabras = texto.trim().split(/\s+/).length;
  const caracteres = texto.length;
  const fecha = new Date().toISOString();

  const resultado = {
    texto,
    palabras,
    caracteres,
    fecha,
  };

  // Guardar en S3
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
