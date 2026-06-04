Write-Host "🚀 Iniciando Demo AWS Serverless 82026..." -ForegroundColor Cyan

# Terminal 1 - LocalStack
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; localstack start"

Write-Host "⏳ Esperando que LocalStack arranque (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Crear buckets
Write-Host "🪣 Creando buckets S3..." -ForegroundColor Yellow
aws --endpoint-url=http://127.0.0.1:4566 s3 mb s3://demo-resultados 2>$null
aws --endpoint-url=http://127.0.0.1:4566 s3 mb s3://demo-athena-results 2>$null

# Terminal 2 - Backend (puerto 3002 si 3001 está ocupado)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; `$env:PORT='3002'; npx ts-node src/server.ts"

Write-Host "⏳ Esperando backend (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Terminal 3 - Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host ""
Write-Host "✅ Todo listo!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000 (o 3002 si CRA cambia el puerto)" -ForegroundColor Green
Write-Host "🔧 Backend:  http://127.0.0.1:3002/procesar" -ForegroundColor Green

# Abrir navegador
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"
