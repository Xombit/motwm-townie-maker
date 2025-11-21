# PowerShell script to package the Townie Maker module for distribution
$moduleName = "motwm-townie-maker"
$version = (Get-Content module.json | ConvertFrom-Json).version
$zipName = "$moduleName-$version.zip"

Write-Host "Building module..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Creating distribution package: $zipName" -ForegroundColor Cyan

# Create temp directory structure
$tempDir = "temp_package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files to temp directory
Copy-Item "module.json" "$tempDir/" -Force
Copy-Item "README.md" "$tempDir/" -Force
Copy-Item "LICENSE" "$tempDir/" -Force
Copy-Item "CHANGELOG.md" "$tempDir/" -Force
Copy-Item "dist" "$tempDir/" -Recurse -Force
Copy-Item "templates" "$tempDir/" -Recurse -Force
Copy-Item "lang" "$tempDir/" -Recurse -Force

# Create zip from temp directory
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force

# Cleanup
Remove-Item $tempDir -Recurse -Force

Write-Host "Package created successfully: $zipName" -ForegroundColor Green
Write-Host "Ready for distribution!" -ForegroundColor Green
