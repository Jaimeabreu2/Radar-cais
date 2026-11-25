# ==============================================================================
# RADAR CAIS — SERVIDOR WEB LOCAL NATIVO (POWERSHELL / .NET)
# Permite testar e visualizar o Painel Web mesmo sem ter Python instalado.
# ==============================================================================
param(
    [int]$Porta = 8080,
    [switch]$NoBrowser
)

$baseDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$frontendDir = Join-Path $baseDir "frontend"
$jsonFile = Join-Path $baseDir "historico_editais.json"
$csvFile = Join-Path $baseDir "pipeline_oportunidades_cais.csv"

$prefix = "http://localhost:$Porta/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "❌ Erro ao iniciar na porta $Porta. Ela pode estar ocupada por outro processo." -ForegroundColor Red
    exit 1
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 RADAR CAIS — SERVIDOR WEB LOCAL INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "👉 Acesse no navegador: $prefix" -ForegroundColor Yellow
Write-Host "📁 Servindo arquivos de: $frontendDir" -ForegroundColor Gray
Write-Host "Pressione Ctrl + C para encerrar o servidor." -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan

if (-not $NoBrowser) {
    Start-Process $prefix
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".csv"  = "text/csv; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $originHeader = $request.Headers["Origin"]
        if ($originHeader -and ($originHeader -match "^https?://(localhost|127\.0\.0\.1)(:\d+)?$")) {
            $response.Headers.Add("Access-Control-Allow-Origin", $originHeader)
        } else {
            $response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:$Porta")
        }
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate")
        $response.Headers.Add("X-Content-Type-Options", "nosniff")
        $response.Headers.Add("X-Frame-Options", "DENY")
        $response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin")

        $rawPath = $request.Url.LocalPath

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        # Endpoints de API REST
        if ($rawPath -eq "/api/editais" -or $rawPath -eq "/historico_editais.json") {
            if (Test-Path $jsonFile) {
                $bytes = [System.IO.File]::ReadAllBytes($jsonFile)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
            }
            $response.Close()
            continue
        }

        if ($rawPath -eq "/api/varredura") {
            $jsonOk = '{"status": "ok", "mensagem": "Base local sincronizada."}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonOk)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($rawPath -eq "/api/status-varredura") {
            $jsonStatus = '{"em_progresso": false, "mensagem": "Servidor em modo de visualização local."}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStatus)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        if ($rawPath -eq "/api/download/csv" -or $rawPath -eq "/pipeline_oportunidades_cais.csv") {
            if (Test-Path $csvFile) {
                $bytes = [System.IO.File]::ReadAllBytes($csvFile)
                $response.ContentType = "text/csv; charset=utf-8"
                $response.Headers.Add("Content-Disposition", "attachment; filename=`"pipeline_oportunidades_cais.csv`"")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
            }
            $response.Close()
            continue
        }

        if ($rawPath -eq "/api/gestao") {
            if ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $bodyStr = $reader.ReadToEnd()
                $reader.Close()
                try {
                    $novoGestao = $bodyStr | ConvertFrom-Json
                    if (Test-Path $jsonFile) {
                        $dadosAtuais = Get-Content $jsonFile -Raw -Encoding UTF8 | ConvertFrom-Json
                        $dadosAtuais | Add-Member -NotePropertyName "gestao_interna" -NotePropertyValue $novoGestao -Force
                        $jsonAtualizado = $dadosAtuais | ConvertTo-Json -Depth 12
                        [System.IO.File]::WriteAllText($jsonFile, $jsonAtualizado, [System.Text.Encoding]::UTF8)
                        $frontJson = Join-Path $frontendDir "historico_editais.json"
                        if (Test-Path $frontendDir) {
                            [System.IO.File]::WriteAllText($frontJson, $jsonAtualizado, [System.Text.Encoding]::UTF8)
                        }
                    }
                    $okBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status": "ok"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.ContentLength64 = $okBytes.Length
                    $response.OutputStream.Write($okBytes, 0, $okBytes.Length)
                } catch {
                    $response.StatusCode = 400
                }
                $response.Close()
                continue
            } else {
                $gestaoOut = "{}"
                if (Test-Path $jsonFile) {
                    try {
                        $dadosAtuais = Get-Content $jsonFile -Raw -Encoding UTF8 | ConvertFrom-Json
                        if ($null -ne $dadosAtuais.gestao_interna) {
                            $gestaoOut = $dadosAtuais.gestao_interna | ConvertTo-Json -Depth 10
                        }
                    } catch {}
                }
                $gBytes = [System.Text.Encoding]::UTF8.GetBytes($gestaoOut)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $gBytes.Length
                $response.OutputStream.Write($gBytes, 0, $gBytes.Length)
                $response.Close()
                continue
            }
        }

        # Arquivos estáticos restritos exclusivamente ao diretório frontend (proteção contra Path Traversal)
        $relPath = $rawPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        $frontendDirFull = [System.IO.Path]::GetFullPath($frontendDir)
        $candidatePath = [System.IO.Path]::GetFullPath((Join-Path $frontendDirFull $relPath))
        if (-not $candidatePath.StartsWith($frontendDirFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $err = [System.Text.Encoding]::UTF8.GetBytes("Acesso negado.")
            $response.OutputStream.Write($err, 0, $err.Length)
            $response.Close()
            continue
        }
        $targetFile = $candidatePath

        if (Test-Path $targetFile -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($targetFile).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($targetFile)

            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("Arquivo nao encontrado: $rawPath")
            $response.OutputStream.Write($err, 0, $err.Length)
        }

        $response.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
