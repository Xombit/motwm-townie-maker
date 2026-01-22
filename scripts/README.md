# Development Scripts

## deploy.ps1
Builds and deploys the module to Foundry VTT for testing.

**What it does:**
1. Runs `npm run build`
2. Copies only necessary files to Foundry modules directory:
   - `module.json`
   - `README.md`
   - `LICENSE`
   - `dist/` (compiled JavaScript and CSS)
   - `templates/` (Handlebars templates)
   - `lang/` (localization files)
   - `images/` (if present)

**Usage:**
```bash
npm run deploy
```

Or directly:
```powershell
.\scripts\deploy.ps1
```

## dev.ps1
Development mode with automatic file watching and deployment.

**What it does:**
1. Performs initial deployment
2. Watches for changes in deployment-relevant files
3. Auto-copies changes to Foundry modules directory
4. Debounces rapid changes (500ms)

**Usage:**
```bash
npm run dev:foundry
```

Or directly:
```powershell
.\scripts\dev.ps1
```

**Tip:** Run this in one terminal, and your changes will automatically deploy as you work!

## pack.ps1
Creates a distribution ZIP file for release.

**What it does:**
1. Builds the module
2. Creates a temporary package directory
3. Copies all necessary files
4. Creates a stable (unversioned) ZIP file: `packages/motwm-townie-maker.zip`
5. Cleans up temporary files

**Usage:**
```powershell
.\scripts\pack.ps1
```

Or via npm:
```bash
npm run pack-win
```

---

## Workflow Recommendations

### Initial Testing
```bash
npm run deploy
```
Then launch/restart Foundry and enable the module.

### Active Development
```bash
npm run dev:foundry
```
Leave this running. Changes to `dist/`, `templates/`, `lang/`, or `module.json` will auto-deploy.

In another terminal:
```bash
npm run watch
```
This rebuilds TypeScript/CSS changes into `dist/`.

### Creating Release
```powershell
.\scripts\pack.ps1
```
Upload the generated ZIP file to GitHub releases.
