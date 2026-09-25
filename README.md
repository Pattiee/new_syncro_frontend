# Syncro Frontend Shell 🚀

This project has been migrated from JavaScript to **React + TypeScript**, optimized using **CRACO** for static asset compression, and configured for secure **Docker** multi-stage deployments.

---

## 🛠️ Tech Stack & Architecture Baseline

*   **Runtime Environment:** Node.js `^18.0.0` (Configured via `.nvmrc`)
*   **Package Manager:** `pnpm` (Configured via `.npmrc` to prevent lockfiles mutations)
*   **State Management:** Redux Toolkit + Redux Persist (Securely encrypted via Crypto-JS transforms)
*   **Styling Configuration:** Tailwind CSS + Auto-injected Global Dark Mode Listeners
*   **Build Optimization Engine:** CRACO + Webpack 5 Static Asset Compression (Brotli + Gzip)
*   **Production Serving Core:** Nginx reverse proxy architecture with native Brotli capability

---

## 🚀 Available Development Scripts

In the project directory, use `pnpm` to execute the following scripts:

### `pnpm start`
Runs the app in the local development mode via CRACO.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The workspace triggers hot reloading instantly upon file changes.

### `pnpm type-check`
Runs a strict compilation validation check across all `.ts` and `.tsx` modules inside your `/src` layout directory to catch hidden compilation type errors without building files.

### `pnpm build`
Compiles the application for production inside the `/build` directory. It optimizes, minifies, hashes filenames, and outputs pre-compressed assets (`.gz` and `.br`) via the configured `craco.config.js` pipelines.

---

## 🔄 Cross-Platform Automatic Node Switching Setup

This project requires **Node.js 18**. To avoid manual configuration mistakes when changing folders, append the appropriate code snippet below to your global machine environment profile.

### Option A: For Linux / macOS (Zsh Setup)
1. Open your terminal profile: `nano ~/.zshrc`
2. Append this code to the bottom of the file:
   ```bash
   autoload -U add-zsh-hook
   load-nvmrc() {
     local nvmrc_path="$(nvm_find_nvmrc)"
     if [ -n "$nvmrc_path" ]; then
       local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
       if [ "$nvmrc_node_version" = "N/A" ]; then
         nvm install
       elif [ "$nvmrc_node_version" != "$(nvm current)" ]; then
         nvm use
       fi
     elif [ "$(nvm current)" != "$(nvm version default)" ]; then
       echo "Reverting to default Node version"
       nvm use default
     fi
   }
   add-zsh-hook chpwd load-nvmrc
   load-nvmrc
   ```
3. Refresh your shell environment configurations: `source ~/.zshrc`

### Option B: For Linux / Subsystems (Bash Setup)
1. Open your terminal profile: `nano ~/.bashrc`
2. Append this code to the bottom of the file:
   ```bash
   cd() {
     builtin cd "$@" || return
     if [ -f .nvmrc ]; then
       local target_node="$(cat .nvmrc | tr -d 'v')"
       if [[ "$(node -v)" != *"v${target_node}"* ]]; then
          echo "🔄 .nvmrc detected. Switching shell to Node ${target_node}..."
          [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
          nvm use
       fi
     fi
   }
   ```
3. Refresh your shell environment configurations: `source ~/.bashrc`

### Option C: For Windows (PowerShell Setup)
1. Open your global user profile script: `notepad $PROFILE`
2. Paste this wrapper function directly into the text layout and save it:
   ```powershell
   function prompted-cd {
       param([string]$path)
       if ($path) { Set-Location $path } else { Set-Location ~ }
       
       if (Test-Path ".nvmrc") {
           $targetNode = (Get-Content .nvmrc).Trim().Replace("v", "")
           Write-Host "🔄 .nvmrc detected. Switching shell to Node $targetNode..." -ForegroundColor Orange
           nvm use $targetNode
       }
   }
   Set-Alias cd prompted-cd -Option ReadOnly -Force
   ```
3. Close and reopen your terminal app window.

---

## 🐳 Docker Deployment Strategy

The application bundles its code using a strict, multi-stage layout image optimized to save CPU bandwidth by utilizing pre-compressed Brotli blocks.

### 1. Build the Production Container
```bash
docker build -t syncro-frontend .
```

### 2. Launch the Container Locally
```bash
docker run -d -p 3000:3000 --name syncro-web syncro-frontend
```

This boots an Nginx server listening on port `3000`, automatically applies local browser security filters, hooks up real-time WebSocket connection channels, and proxies requests starting with `/api/` cleanly to your Spring Boot backend service container named `gateway`.

---

## 🐙 Docker Compose Multi-Container Orchestration Matrix

To quickly orchestrate the frontend Nginx reverse proxy shell alongside your Spring Boot microservice environment inside an isolated network stack, use the root-level `docker-compose.yml` configurations:

### 1. Spin Up the Ecosystem (Clean Background Build)
Forces Docker to pull fresh dependencies, compile asset bundles using your `.env.production` definitions, and bridge container links:
```bash
docker compose up -d --build
```

### 2. Monitor Container Interactions
Watch real-time requests passing securely between your Nginx layer and the backend Spring Boot routing nodes:
```bash
docker compose logs -f
```

### 3. Graceful Multi-Service Teardown
To update configurations, switch variables, or refresh code builds cleanly:
```bash
docker compose down
```

---

## 🏁 Step-by-Step Local & Container Run Procedures

To prevent cache invalidation glitches, stale Webpack distributions, or lockfile mismatches between host operating systems and container nodes, execute these steps in order:

### Phase 1: Wiping Local Cache & Dependencies (The Clean Slate)
Run these commands in your local project root if you encounter mismatched dependency configurations or cache compilation loops:

#### Purge Local Node Structures & Assets:
```bash
# Linux / macOS / Git Bash
rm -rf node_modules build dist .tsbuildinfo

# Windows PowerShell
Remove-Item -Recurse -Force node_modules, build, dist, .tsbuildinfo -ErrorAction SilentlyContinue
```

#### Clear the Global Package Manager Cache:
```bash
pnpm store prune
```

### Phase 2: Standard Local Desktop Execution
To install fresh versions of your modules and boot the development workflow locally on your system hardware:

#### Trigger a Pristine Installation Pass:
```bash
pnpm install --frozen-lockfile
```

#### Launch the Real-Time Dev Workspace Engine:
```bash
pnpm start
```
* Open [http://localhost:3000](http://localhost:3000) to view your environment page. Webpack will proxy your requests to `http://localhost:8080` based on your `.env.development` configurations.

### Phase 3: Building & Deploying the Container (Production Emulation)
To verify that your multi-stage Docker layers compile correctly, bundle your static `.br`/`.gz` assets, and route through Nginx:

#### Wipe Existing Local Containers & Stale Volumes:
```bash
# Stop and drop any active container matching your deployment runtime name
docker rm -f syncro-web 2>/dev/null || true

# Clean up hanging builder cache layers to force a completely fresh assembly
docker builder prune -f
```

#### Execute a Fresh Docker Image Build Command:
```bash
docker build --no-cache -t syncro-frontend .
```
*Note: The `--no-cache` parameter guarantees that every deployment cycle pulls exact packages matching your `pnpm-lock.yaml` file instead of pulling cached container images.*

#### Boot Your Pre-Compressed Nginx Container Instance:
```bash
docker run -d -p 3000:3000 --name syncro-web syncro-frontend
```

#### Verify Runtime Health Status Records:
```bash
# Check active log layers to verify Nginx started without issues
docker logs syncro-web

# Confirm the built-in health-check directive passes successfully
docker ps --filter name=syncro-web
```