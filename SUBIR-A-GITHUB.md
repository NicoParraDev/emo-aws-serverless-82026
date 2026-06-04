# Subir el proyecto a GitHub (sin depender del navegador en Cursor)

## Opción A — Script automático (recomendado)

1. Abre **PowerShell** fuera de Cursor: tecla Windows, escribe `PowerShell`, Enter.
2. Ejecuta:

```powershell
cd C:\Users\nicoa\Desktop\demo-82026
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\push-github.ps1
```

3. Crea un token si no tienes:
   - https://github.com/settings/tokens/new
   - Marca el permiso **repo**
   - Genera y **copia el token**
4. Pégalo cuando el script lo pida (no se verá al escribir).
5. Espera `git push` — listo.

Repo: https://github.com/NicoParraDev/demo-aws-serverless-82026

---

## Opción B — Manual (3 comandos)

En PowerShell, después de crear el token en GitHub:

```powershell
cd C:\Users\nicoa\Desktop\demo-82026
"TU_TOKEN_AQUI" | gh auth login --with-token
gh auth setup-git
git push -u origin main
```

(Reemplaza `TU_TOKEN_AQUI` por el token real.)

---

## Opción C — Login por código (si prefieres sin token pegado)

En **PowerShell externo** (no Cursor):

```powershell
gh auth login
```

Elige: GitHub.com → HTTPS → **Paste an authentication token** (pega el token)
O si ofrece **Login with a web browser**, ábrelo ahí (suele funcionar fuera de Cursor).

Luego:

```powershell
cd C:\Users\nicoa\Desktop\demo-82026
gh auth setup-git
git push -u origin main
```

---

## Errores frecuentes

| Error | Solución |
|-------|----------|
| `Repository not found` | No estás logueado como **NicoParraDev** o el token no tiene permiso `repo` |
| `cd C:\Users\...` falla en Git Bash | Usa `cd ~/Desktop/demo-82026` |
| Nada abre en Cursor | Usa PowerShell **fuera** de Cursor (Opción A o C) |
