# Arranque local: LocalStack, buckets S3, backend y frontend.
# Ejecutar desde la raiz del repo: .\iniciar-demo.ps1

$Root = $PSScriptRoot
$Endpoint = "http://127.0.0.1:4566"

Write-Host "Iniciando Demo AWS Serverless 82026..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root'; localstack start"

Write-Host "Esperando LocalStack (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

aws --endpoint-url=$Endpoint s3 mb s3://demo-resultados 2>$null
aws --endpoint-url=$Endpoint s3 mb s3://demo-athena-results 2>$null
Write-Host "Buckets S3 listos" -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; npm run dev"

Write-Host "Esperando backend (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm start"

Write-Host "Todo listo!" -ForegroundColor Green
Write-Host "Frontend: http://127.0.0.1:3000 (o el puerto que indique npm)" -ForegroundColor Green
Write-Host "Backend:  http://127.0.0.1:3001/procesar" -ForegroundColor Green

Start-Sleep -Seconds 10
Start-Process "http://127.0.0.1:3000"
