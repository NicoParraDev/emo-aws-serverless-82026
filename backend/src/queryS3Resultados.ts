/**
 * Consulta resultados en S3 (equivalente operativo a Athena en local).
 *
 * LocalStack free tier: Athena puede quedar colgado; este script lista
 * resultados/ y muestra una tabla en consola.
 *
 * Uso: npm run query:s3
 */
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  S3ClientConfig,
} from "@aws-sdk/client-s3";

const BUCKET = process.env.BUCKET_NAME || "demo-resultados";
const PREFIX = "resultados/";

function createS3Client(): S3Client {
  const config: S3ClientConfig = {
    region: process.env.AWS_REGION || "us-east-1",
    endpoint: process.env.AWS_ENDPOINT_URL || "http://127.0.0.1:4566",
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
    },
  };
  return new S3Client(config);
}

const s3 = createS3Client();

async function queryResultados(): Promise<void> {
  const list = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX,
    })
  );

  const objects = list.Contents ?? [];
  console.log(`\n${objects.length} registro(s) en s3://${BUCKET}/${PREFIX}\n`);
  console.log("texto | palabras | caracteres | fecha");
  console.log("------|----------|------------|------");

  for (const obj of objects) {
    if (!obj.Key) continue;
    const data = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key })
    );
    const body = await data.Body?.transformToString();
    if (!body) continue;
    const record = JSON.parse(body) as {
      texto?: string;
      palabras?: number;
      caracteres?: number;
      fecha?: string;
    };
    console.log(
      `${record.texto ?? ""} | ${record.palabras ?? 0} | ${record.caracteres ?? 0} | ${record.fecha ?? ""}`
    );
  }
}

queryResultados().catch((err) => {
  console.error(err);
  process.exit(1);
});
