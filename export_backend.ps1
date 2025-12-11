Write-Output "========== EXPORTANDO BACKEND COMPLETO =========="

# Carpetas a exportar
$folders = @("controllers", "routes", "models", "middlewares", "config", "utils")

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Output "========== CARPETA: $folder =========="

        Get-ChildItem -Path $folder -File | ForEach-Object {
            Write-Output "---------- Archivo: $($_.FullName) ----------"
            Get-Content $_.FullName
            Write-Output ""
        }
    }
}

# Archivos en la raiz del proyecto
Write-Output "========== ARCHIVOS JS EN LA RAIZ =========="
Get-ChildItem -Path . -Filter *.js -File | ForEach-Object {
    Write-Output "---------- Archivo: $($_.FullName) ----------"
    Get-Content $_.FullName
    Write-Output ""
}

Write-Output "========== EXPORTACION COMPLETA =========="
