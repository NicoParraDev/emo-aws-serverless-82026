# Backend — Demo 82026

Node.js 20 + TypeScript. Misma logica en **Lambda** (produccion) y **Express** (local).

## Archivos

| Archivo | Rol |
|---------|-----|
| `handler.ts` | Lambda: parsea texto, calcula metricas, guarda JSON en S3 |
| `server.ts` | API Gateway local (`POST /procesar` en `127.0.0.1`) |
| `testLocal.ts` | Invoca el handler sin red |
| `queryS3Resultados.ts` | Lista objetos en S3 (fallback cuando Athena en LocalStack no responde) |
| `setupAthena.ts` | Crea tabla externa `demo_db.resultados` en Athena |

## Variables de entorno

| Variable | Local (tipico) | AWS |
|----------|----------------|-----|
| `BUCKET_NAME` | `demo-resultados` | Inyectada por CDK |
| `AWS_ENDPOINT_URL` | `http://127.0.0.1:4566` | (no usar) |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `test` / `test` | Rol IAM de Lambda |
| `PORT` | `3001` | N/A |

## Comandos

```bash
npm run dev            # Express en http://127.0.0.1:3001/procesar
npm run test:handler   # Probar handler directo
npm run query:s3       # Tabla de resultados desde S3
npm run setup:athena   # Crear tabla Athena (LocalStack)
```

## Contrato API

**POST** `/procesar`

```json
{ "texto": "Contrato servicios enero 2026" }
```

**200**

```json
{
  "texto": "Contrato servicios enero 2026",
  "palabras": 4,
  "caracteres": 32,
  "fecha": "2026-01-15T12:00:00.000Z"
}
```

**400** — body JSON invalido. **500** — error al escribir en S3.

Objetos en S3: `resultados/{timestamp}.json`.
