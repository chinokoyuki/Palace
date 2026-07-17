: 'koyuki-studyhub-deploy.sh'
#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# KoyukiStudyHub Docker Rebuild Script
# Usage: bash /opt/KoyukiStudyHub/deploy.sh
# ============================================================

REPO_DIR="/opt/KoyukiStudyHub"
PROJECT_NAME="koyuki-studyhub"

cd "$REPO_DIR"

echo "[1/5] Pulling latest changes..."
git pull --ff-only

echo "[2/5] Building Docker image..."
docker compose build --no-cache

echo "[3/5] Recreating container..."
docker compose up -d --force-recreate

echo "[4/5] Waiting for service to become healthy..."
sleep 3
if docker compose ps | grep -q "healthy"; then
  echo "Service is healthy."
else
  echo "Warning: service health not confirmed. Check logs with: docker compose logs -f"
fi

echo "[5/5] Cleaning up old images..."
docker image prune -f

echo ""
echo "✅ Deployment complete!"
echo "Local: http://127.0.0.1:8080"
