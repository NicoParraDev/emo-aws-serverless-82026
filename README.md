# Demo AWS Serverless — Proceso 82026

Stack serverless desarrollado como demostración técnica para posición Fullstack.

## Arquitectura

React + TypeScript → API Gateway (Express) → Lambda (Node.js) → S3 → Athena

## Tecnologías

- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript (Lambda handler)
- **Cloud:** AWS Lambda, API Gateway, S3, Athena (LocalStack)
- **IaC:** AWS CDK (próximo paso)
- **Tools:** Docker, LocalStack

## Cómo correr localmente

### Requisitos
- Docker Desktop
- Node.js
- LocalStack

### Pasos

1. Levantar LocalStack:
```
localstack start
```

2. Crear bucket S3:
```
aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-resultados
aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-athena-results
```

3. Iniciar backend:
```
cd backend
npx ts-node src/server.ts
```

4. Iniciar frontend:
```
cd frontend
npm start
```

5. Abrir http://localhost:3000

## Flujo de datos

1. Usuario ingresa texto en React
2. Frontend llama POST /procesar
3. Lambda procesa: cuenta palabras y caracteres
4. Resultado se guarda en S3 como JSON
5. Athena puede consultar los datos via SQL sobre S3
