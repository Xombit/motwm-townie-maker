# PowerShell script to deploy module to Foundry for testing
# Only copies necessary runtime files, not source code

param(
    # Optional override. If omitted, common Foundry module locations are tried.
    [string]$FoundryModulesPath
)

$moduleName = "motwm-townie-maker"

# Prefer an explicit path, then common defaults.
$candidatePaths = @(
    $FoundryModulesPath,
    "E:\foundrytest\foundrydata\Data\modules",
    "C:\Users\User\AppData\Local\FoundryVTT\Data\modules"
) | Where-Object { $_ -and $_.Trim() -ne "" } | Select-Object -Unique

$foundryModulesPath = $null
foreach ($p in $candidatePaths) {
    if (Test-Path $p) {
        $foundryModulesPath = $p
        break
    }
}

if (-not $foundryModulesPath) {
    Write-Host "Error: Foundry modules directory not found." -ForegroundColor Red
    Write-Host "Tried:" -ForegroundColor Yellow
    $candidatePaths | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host "Provide a path via: .\\scripts\\deploy.ps1 -FoundryModulesPath <path>" -ForegroundColor Yellow
    exit 1
}

$targetPath = Join-Path $foundryModulesPath $moduleName

Write-Host "Deploying $moduleName to Foundry VTT..." -ForegroundColor Cyan

Write-Host "Foundry modules directory: $foundryModulesPath" -ForegroundColor DarkCyan

# Build first
Write-Host "Building module..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Aborting deployment." -ForegroundColor Red
    exit 1
}

# Create target directory if it doesn't exist
if (-not (Test-Path $targetPath)) {
    Write-Host "Creating module directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
}

# Copy only necessary files
Write-Host "Copying files..." -ForegroundColor Yellow

# Core files
Copy-Item "module.json" $targetPath -Force
Copy-Item "README.md" $targetPath -Force
Copy-Item "LICENSE" $targetPath -Force

# Built files (dist folder)
if (Test-Path "dist") {
    $distTarget = Join-Path $targetPath "dist"
    if (Test-Path $distTarget) {
        Remove-Item $distTarget -Recurse -Force
    }
    Copy-Item "dist" $distTarget -Recurse -Force
}

# Templates
if (Test-Path "templates") {
    $templatesTarget = Join-Path $targetPath "templates"
    if (Test-Path $templatesTarget) {
        Remove-Item $templatesTarget -Recurse -Force
    }
    Copy-Item "templates" $templatesTarget -Recurse -Force
}

# Language files
if (Test-Path "lang") {
    $langTarget = Join-Path $targetPath "lang"
    if (Test-Path $langTarget) {
        Remove-Item $langTarget -Recurse -Force
    }
    Copy-Item "lang" $langTarget -Recurse -Force
}

# Images (if they exist)
if (Test-Path "images") {
    $imagesTarget = Join-Path $targetPath "images"
    if (Test-Path $imagesTarget) {
        Remove-Item $imagesTarget -Recurse -Force
    }
    Copy-Item "images" $imagesTarget -Recurse -Force
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Module deployed to: $targetPath" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Launch/Restart Foundry VTT" -ForegroundColor White
Write-Host "  2. Enable '$moduleName' in your world's module settings" -ForegroundColor White
Write-Host "  3. Open Actor Directory and look for the 'Townie Maker' button" -ForegroundColor White
Write-Host "`nFor continuous development, use: npm run watch" -ForegroundColor Cyan
