/**
 * Lambda handler — procesamiento de texto y persistencia en S3.
 *
 * Entrada: evento API Gateway con body JSON `{ "texto": string }`.
 * Salida: HTTP 200 + métricas (palabras, caracteres, fecha) y objeto en S3.
 *
 * Local: usa AWS_ENDPOINT_URL o 127.0.0.1:4566 (LocalStack) si no hay AWS_LAMBDA_FUNCTION_NAME.
 * AWS:   variable BUCKET_NAME inyectada por CDK.
 */
import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.BUCKET_NAME || "demo-resultados";

export interface ProcesarRequestBody {
  texto?: string;
}

export interface ProcesarResultado {
  texto: string;
  palabras: number;
  caracteres: number;
  fecha: string;
}

export interface ApiGatewayLikeEvent {
  body?: string;
}

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

function jsonResponse(
  statusCode: number,
  body: object
): { statusCode: number; headers: Record<string, string>; body: string } {
  return {
    statusCode,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  };
}

export const handler = async (event: ApiGatewayLikeEvent) => {
  let body: ProcesarRequestBody;
  try {
    body = JSON.parse(event.body || "{}") as ProcesarRequestBody;
  } catch {
    return jsonResponse(400, { error: "Body JSON invalido" });
  }

  const texto: string = typeof body.texto === "string" ? body.texto : "";

  const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const caracteres = texto.length;
  const fecha = new Date().toISOString();

  const resultado: ProcesarResultado = {
    texto,
    palabras,
    caracteres,
    fecha,
  };

  const key = `resultados/${Date.now()}.json`;
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(resultado),
        ContentType: "application/json",
      })
    );
  } catch (err) {
    console.error("Error al guardar en S3:", err);
    return jsonResponse(500, { error: "No se pudo guardar en S3" });
  }

  return jsonResponse(200, resultado);
};
