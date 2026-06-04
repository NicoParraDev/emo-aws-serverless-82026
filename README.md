# Demo AWS Serverless — Proceso 82026

Stack serverless desarrollado como demostración técnica para posición Fullstack.

## Arquitectura

```
React (CloudFront + S3)
        │
        ▼ POST /procesar
   API Gateway (HTTP API)
        │
        ▼
   Lambda (Node.js + TypeScript)
        │
        ▼
   S3 (JSON) ──► Athena (consulta SQL)
```

**Local:** Express simula API Gateway · **AWS:** CDK despliega la infraestructura completa.

## Tecnologías

| Área | Stack |
|------|--------|
| Frontend | React + TypeScript, UI kit Nimbus |
| Backend | Node.js + TypeScript (Lambda handler) |
| API local | Express + CORS |
| Cloud | Lambda, API Gateway, S3, Athena, CloudFront |
| IaC | AWS CDK (TypeScript) |
| CI/CD | GitHub Actions |
| Scripts | Python + boto3 (lectura S3) |
| Local | Docker, LocalStack |

## Estructura del repo

```
demo-82026/
├── frontend/          # React app
├── backend/           # Lambda handler + servidor local
├── infrastructure/  # AWS CDK (S3, Lambda, API GW, CloudFront)
├── python/            # Script de consulta S3
└── .github/workflows/ # CI
```

## Cómo correr localmente

### Requisitos

- Docker Desktop
- Node.js 20+
- LocalStack
- Python 3.12+ (opcional, para script)

### Pasos

1. **LocalStack:**
   ```bash
   localstack start
   ```

2. **Buckets S3:**
   ```bash
   aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-resultados
   aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-athena-results
   ```

3. **Backend** (puerto 3002 si 3001 está ocupado):
   ```bash
   cd backend
   set PORT=3002
   npm run dev
   ```

4. **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

5. Abrir **http://localhost:3000**

### Script Python (consulta S3)

```bash
cd python
pip install -r requirements.txt
set AWS_ENDPOINT_URL=http://localhost:4566
set AWS_ACCESS_KEY_ID=test
set AWS_SECRET_ACCESS_KEY=test
python read_s3_results.py --bucket demo-resultados
```

## Despliegue AWS con CDK

```bash
cd frontend && npm run build
cd ../infrastructure
npm install
npm run build
npx cdk bootstrap   # primera vez
npx cdk deploy
```

Outputs: URL de CloudFront, API Gateway, buckets S3 y nombre de Lambda.

## Flujo de datos

1. Usuario ingresa texto en React
2. Frontend llama `POST /procesar`
3. Lambda procesa: palabras, caracteres, timestamp
4. Resultado se guarda en S3 como JSON bajo `resultados/`
5. Athena puede consultar el bucket (tabla externa)
6. Python `read_s3_results.py` resume los mismos datos desde S3

## CI (GitHub Actions)

En cada push a `main`: build frontend, typecheck backend, `cdk synth`.
