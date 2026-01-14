# PowerShell script to package the Townie Maker module for distribution
$moduleName = "motwm-townie-maker"

# Validate module.json exists and is valid JSON
if (-not (Test-Path "module.json")) {
    Write-Host "ERROR: module.json not found!" -ForegroundColor Red
    exit 1
}

try {
    $moduleJson = Get-Content "module.json" | ConvertFrom-Json
    $version = $moduleJson.version
    Write-Host "Packaging $moduleName v$version" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: module.json is not valid JSON!" -ForegroundColor Red
    exit 1
}

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
Copy-Item "images" "$tempDir/" -Recurse -Force

Write-Host "Packaged files:" -ForegroundColor Yellow
Write-Host "  - module.json (v$version)"
Write-Host "  - README.md, LICENSE, CHANGELOG.md"
Write-Host "  - dist/ (compiled code)"
Write-Host "  - templates/ (Handlebars UI)"
Write-Host "  - lang/ (localization)"
Write-Host "  - images/ (character artwork)"

# Create zip from temp directory
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force

# Cleanup
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "Package created successfully: $zipName" -ForegroundColor Green

# Show package size
$zipSize = (Get-Item $zipName).Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)
Write-Host "Package size: $zipSizeMB MB" -ForegroundColor Cyan

Write-Host ""
Write-Host "Ready for distribution!" -ForegroundColor Green
Write-Host "Upload to: https://github.com/Xombit/motwm-townie-maker/releases" -ForegroundColor Yellow
