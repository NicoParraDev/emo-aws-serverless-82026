Write-Host "Iniciando Demo AWS Serverless 82026..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\nicoa\Desktop\demo-82026'; localstack start"

Write-Host "Esperando LocalStack (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-resultados 2>$null
aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-athena-results 2>$null
Write-Host "Buckets S3 listos" -ForegroundColor Green

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\nicoa\Desktop\demo-82026\backend'; npx ts-node src/server.ts"

Write-Host "Esperando backend (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\nicoa\Desktop\demo-82026\frontend'; npm start"

Write-Host "Todo listo!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://127.0.0.1:3002" -ForegroundColor Green

Start-Sleep -Seconds 10
Start-Process "http://localhost:3000"
