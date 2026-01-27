# Deploying to Zeabur

This guide will help you deploy the Travel Planner (Frontend + Backend + Database) to [Zeabur](https://zeabur.com).

## Prerequisites
- A GitHub account with this project pushed to a repository.
- A [Zeabur](https://zeabur.com) account.

## Steps

### 1. Create a Project on Zeabur
1. Log in to the Zeabur dashboard.
2. Click **Create Project** and select a region (e.g., Tokyo or Taipei).

### 2. Deploy MongoDB
1. In your project, click **Create Service** -> **Marketplace**.
2. Search for **MongoDB** and select it.
3. Once created, click on the MongoDB service.
4. Go to the **Instruction** tab to find your connection string (e.g., `mongodb://root:password@...`).
   - *Note: You can use the internal connection string if deploying backend in the same project.*

### 3. Deploy Backend (Node.js)
1. In the project, click **Create Service** -> **Git**.
2. Select your repository (`travel-planning`).
3. Zeabur usually auto-detects the service. If you have a monorepo structure, you might need to configure the **Root Directory** settings.
   - Go to **Settings** -> **Source** -> **Root Directory**.
   - Set it to `server`.
4. Go to **Variables**.
   - Add `MONGODB_URI` and paste the connection string from Step 2.
   - Add `GOOGLE_MAPS_API_KEY` (if your backend needs it, though currently only frontend does).
5. Zeabur will automatically build and deploy `server/index.js`.
6. Once deployed, go to the **Networking** tab and enable **Public Networking** to get a domain (e.g., `travel-api.zeabur.app`).

### 4. Deploy Frontend (React/Vite)
1. In the project, click **Create Service** -> **Git**.
2. Select your repository (`travel-planning`) *again*.
3. Go to **Settings** -> **Source** -> **Root Directory**.
   - Keep it as `/` (root) since `package.json` for frontend is in the root.
4. Go to **Variables**.
   - Add `VITE_API_URL` and set it to your backend domain (e.g., `https://travel-api.zeabur.app/api`).
   - Add `VITE_GOOGLE_MAPS_API_KEY` with your Google Maps API key.
5. Zeabur will detect `vite.config.js` and build it automatically.
6. Enable **Public Networking** to get your frontend domain.

## Verification
- Visit your frontend domain.
- Try creating a trip (this tests database connection).
- Check the map (this tests Google Maps API).
