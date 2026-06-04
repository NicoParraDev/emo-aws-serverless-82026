# Subir demo-aws-serverless-82026 a GitHub (cuenta NicoParraDev)
# Ejecutar en PowerShell NORMAL (Win+X -> PowerShell), no hace falta admin.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Subir proyecto a GitHub ===" -ForegroundColor Cyan
Write-Host "Repo: https://github.com/NicoParraDev/demo-aws-serverless-82026" -ForegroundColor Gray
Write-Host ""

# 1) Token (crear en: GitHub -> Settings -> Developer settings -> Fine-grained o classic token con scope 'repo')
Write-Host "Paso 1: Crea un token en GitHub con permiso 'repo':" -ForegroundColor Yellow
Write-Host "  https://github.com/settings/tokens/new" -ForegroundColor Gray
Write-Host ""
$token = Read-Host "Pega aqui tu token (no se mostrara al escribir)" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# 2) Login gh con token
$plainToken | gh auth login --with-token
gh auth setup-git

# 3) Remote (por si falta)
$remoteUrl = "https://github.com/NicoParraDev/demo-aws-serverless-82026.git"
if (git remote get-url origin 2>$null) {
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

git branch -M main
Write-Host ""
Write-Host "Paso 2: Subiendo codigo..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "Listo: https://github.com/NicoParraDev/demo-aws-serverless-82026" -ForegroundColor Green
