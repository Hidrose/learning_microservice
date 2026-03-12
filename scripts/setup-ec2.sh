#!/bin/bash
# ============================================================
# Script setup lần đầu cho AWS EC2 (Ubuntu 22.04 / 24.04)
# Chạy một lần duy nhất sau khi tạo EC2 instance mới
#
# Cách dùng:
#   chmod +x scripts/setup-ec2.sh
#   ./scripts/setup-ec2.sh
# ============================================================
set -e

REPO_URL="https://github.com/Hidrose/learning_microservice.git"
APP_DIR="$HOME/learning_microservice"

echo "============================================"
echo " EC2 First-time Setup"
echo "============================================"

# ── 1. Cập nhật hệ thống ────────────────────────────────────
echo ""
echo "[1/5] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ── 2. Cài Docker ───────────────────────────────────────────
echo ""
echo "[2/5] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm get-docker.sh
  sudo usermod -aG docker "$USER"
  echo "Docker installed."
else
  echo "Docker already installed: $(docker --version)"
fi

# ── 3. Cài docker-compose ───────────────────────────────────
echo ""
echo "[3/5] Installing docker-compose..."
if ! command -v docker-compose &> /dev/null; then
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  echo "docker-compose installed: $(docker-compose --version)"
else
  echo "docker-compose already installed: $(docker-compose --version)"
fi

# Cài jq (dùng trong deploy script)
sudo apt-get install -y jq git curl

# ── 4. Clone repo ───────────────────────────────────────────
echo ""
echo "[4/5] Cloning repository..."
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
  echo "Repo cloned to $APP_DIR"
else
  echo "Repo already exists at $APP_DIR — pulling latest..."
  cd "$APP_DIR" && git pull origin main
fi

# ── 5. Tạo file .env ────────────────────────────────────────
echo ""
echo "[5/5] Setting up .env file..."
cd "$APP_DIR"

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ""
  echo "================================================================"
  echo "  File .env đã được tạo từ .env.example"
  echo "  Hãy chỉnh sửa file .env trước khi khởi động:"
  echo "    nano $APP_DIR/.env"
  echo "================================================================"
else
  echo ".env already exists — skipping."
fi

echo ""
echo "============================================"
echo " Setup hoàn tất!"
echo ""
echo " Bước tiếp theo:"
echo "  1. Chỉnh sửa .env:  nano $APP_DIR/.env"
echo "  2. Khởi động:        cd $APP_DIR && docker-compose -f docker-compose.prod.yml up -d"
echo "  3. Kiểm tra logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo " Lưu ý: Logout và login lại để áp dụng quyền Docker:"
echo "   newgrp docker"
echo "============================================"
