import { AthenaClient, StartQueryExecutionCommand, GetQueryResultsCommand, GetQueryExecutionCommand } from "@aws-sdk/client-athena";

const athena = new AthenaClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

async function setup() {
  // Crear tabla apuntando al bucket S3
  const createTable = await athena.send(new StartQueryExecutionCommand({
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
  }));

  console.log("Tabla creada, QueryExecutionId:", createTable.QueryExecutionId);
}

setup().catch(console.error);
