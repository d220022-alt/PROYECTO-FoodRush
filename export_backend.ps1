$OutputFile = "backend_full.txt"

# Si el archivo existe, lo borra
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile
}

"======== EXPORTACIÓN COMPLETA DEL BACKEND ========" | Out-File -FilePath $OutputFile -Encoding UTF8
"Fecha: $(Get-Date)" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
"`n`n" | Out-File -FilePath $OutputFile -Append -Encoding UTF8

Get-ChildItem -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
    "---------- ARCHIVO: $relativePath ----------" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
    Get-Content $_ | Out-File -FilePath $OutputFile -Append -Encoding UTF8
    "`n`n" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
}

"======== FIN DEL BACKEND ========" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
