/**
 * Crea la tabla externa Athena demo_db.resultados sobre S3 (LocalStack).
 *
 * Requiere bucket demo-athena-results para la salida de consultas.
 * Uso: npm run setup:athena
 */
import {
  AthenaClient,
  StartQueryExecutionCommand,
} from "@aws-sdk/client-athena";

const endpoint = process.env.AWS_ENDPOINT_URL || "http://127.0.0.1:4566";

const athena = new AthenaClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

async function setup(): Promise<void> {
  const createTable = await athena.send(
    new StartQueryExecutionCommand({
      QueryString: `
      CREATE EXTERNAL TABLE IF NOT EXISTS demo_db.resultados (
        texto STRING,
        palabras INT,
        caracteres INT,
        fecha STRING
      )
      ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
      LOCATION 's3://demo-resultados/resultados/'
    `,
      ResultConfiguration: { OutputLocation: "s3://demo-athena-results/" },
    })
  );

  console.log("Tabla creada, QueryExecutionId:", createTable.QueryExecutionId);
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
