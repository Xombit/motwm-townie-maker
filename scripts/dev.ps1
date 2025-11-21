# PowerShell script for continuous development
# Deploys once, then watches for changes and auto-deploys

$moduleName = "motwm-townie-maker"
$foundryModulesPath = "C:\Users\User\AppData\Local\FoundryVTT\Data\modules"
$targetPath = Join-Path $foundryModulesPath $moduleName

Write-Host "Starting development mode for $moduleName..." -ForegroundColor Cyan
Write-Host "Module will be deployed to: $targetPath" -ForegroundColor Yellow
Write-Host ""

# Initial deployment
Write-Host "Performing initial deployment..." -ForegroundColor Yellow
& "$PSScriptRoot\deploy.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Initial deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  WATCH MODE ACTIVE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Watching for changes in:" -ForegroundColor Yellow
Write-Host "  - dist/" -ForegroundColor White
Write-Host "  - templates/" -ForegroundColor White
Write-Host "  - lang/" -ForegroundColor White
Write-Host "  - module.json" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop watching" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to copy specific files/folders
function Deploy-Files {
    param($message)
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $message" -ForegroundColor Cyan
    
    try {
        # Copy dist
        if (Test-Path "dist") {
            $distTarget = Join-Path $targetPath "dist"
            Copy-Item "dist\*" $distTarget -Recurse -Force
        }
        
        # Copy templates
        if (Test-Path "templates") {
            $templatesTarget = Join-Path $targetPath "templates"
            Copy-Item "templates\*" $templatesTarget -Recurse -Force
        }
        
        # Copy lang
        if (Test-Path "lang") {
            $langTarget = Join-Path $targetPath "lang"
            Copy-Item "lang\*" $langTarget -Recurse -Force
        }
        
        # Copy module.json
        Copy-Item "module.json" $targetPath -Force
        
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✓ Files updated" -ForegroundColor Green
    }
    catch {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✗ Error: $_" -ForegroundColor Red
    }
}

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PSScriptRoot + "\.."
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Debounce timer
$timer = $null
$debounceMs = 500

# Define what to do when a file changes
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $name = $Event.SourceEventArgs.Name
    
    # Ignore node_modules, src, .git, and other non-deployment files
    if ($name -match "^(node_modules|src|\\.git|scripts|package|tsconfig|vite\\.config|\\.gitignore)") {
        return
    }
    
    # Only watch files we actually deploy
    if ($name -notmatch "^(dist|templates|lang|module\\.json)") {
        return
    }
    
    # Debounce: cancel existing timer and create new one
    if ($null -ne $script:timer) {
        $script:timer.Stop()
        $script:timer.Dispose()
    }
    
    $script:timer = New-Object System.Timers.Timer
    $script:timer.Interval = $script:debounceMs
    $script:timer.AutoReset = $false
    
    Register-ObjectEvent -InputObject $script:timer -EventName Elapsed -Action {
        Deploy-Files "Change detected, updating..."
    } | Out-Null
    
    $script:timer.Start()
}

# Register the event handlers
$handlers = @(
    (Register-ObjectEvent $watcher "Created" -Action $action),
    (Register-ObjectEvent $watcher "Changed" -Action $action),
    (Register-ObjectEvent $watcher "Deleted" -Action $action)
)

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Cleanup on exit
    Write-Host "`nStopping watch mode..." -ForegroundColor Yellow
    $watcher.EnableRaisingEvents = $false
    $handlers | ForEach-Object { Unregister-Event $_.Name }
    $watcher.Dispose()
    if ($null -ne $timer) {
        $timer.Dispose()
    }
    Write-Host "Watch mode stopped." -ForegroundColor Green
}
