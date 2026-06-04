import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

async function queryResultados() {
  // Listar todos los archivos en el bucket (lo que haría Athena)
  const list = await s3.send(new ListObjectsV2Command({
    Bucket: "demo-resultados",
    Prefix: "resultados/",
  }));

  console.log(`\n📊 Consulta sobre ${list.Contents?.length} registro(s) en S3:\n`);
  console.log("texto | palabras | caracteres | fecha");
  console.log("------|----------|------------|------");

  for (const obj of list.Contents || []) {
    const data = await s3.send(new GetObjectCommand({
      Bucket: "demo-resultados",
      Key: obj.Key!,
    }));
    const body = await data.Body?.transformToString();
    const record = JSON.parse(body!);
    console.log(`${record.texto} | ${record.palabras} | ${record.caracteres} | ${record.fecha}`);
  }
}

queryResultados().catch(console.error);
