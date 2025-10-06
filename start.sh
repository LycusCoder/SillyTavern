#!/usr/bin/env bash

# Pastikan kita berada di direktori script ini
ROOT_DIR="$(dirname "$0")"
cd "$ROOT_DIR"

# --- Fungsi untuk Cek dan Instal Node/NPM/NVM (Tetap Dipertahankan) ---
if ! command -v npm &> /dev/null
then
    read -p "Node.js/npm is not installed. Do you want to install it via nvm? (y/n)" choice
    case "$choice" in
      y|Y )
        echo "Installing nvm..."
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        source ~/.bashrc # Sesuaikan dengan shell kamu!
        nvm install --lts
        nvm use --lts
        if ! command -v npm &> /dev/null; then 
            echo "NVM installed, but Node/npm still not found. Please run 'source ~/.bashrc' or restart your terminal."
            exit 1
        fi
        ;;
      n|N )
        echo "Node.js and npm are required. Exiting."
        exit 1;;
      * )
        echo "Invalid option. Exiting."
        exit 1;;
    esac
fi

# --- Cek dan Instal Yarn ---
if ! command -v yarn &> /dev/null
then
    echo "Yarn is not installed. Installing it globally via npm..."
    npm install -g yarn
fi

# ----------------------------------------------------
# --- BAGIAN INSTALASI (Diubah sedikit untuk FRONTEND) ---
# ----------------------------------------------------
export NODE_ENV=development # Kita pakai mode dev agar Vite jalan benar
echo "Starting Installation & Setup..."

# 1. Instalasi di ROOT (Frontend)
echo "1/2: Installing FRONTEND (ROOT) Node Modules using Yarn..."
rm -f package-lock.json 
yarn install --silent

# 2. Instalasi di BACKEND Sub-folder
echo "2/2: Installing BACKEND Node Modules using Yarn (Subshell)..."
(
    cd "$ROOT_DIR/backend" || exit 1
    rm -f package-lock.json 
    yarn install --silent
)
echo "✅ Installation Done."

# -----------------------------------------------
# --- BAGIAN RUN (Diubah untuk menjalankan 2 server) ---
# -----------------------------------------------

echo ""
echo "🔥 Starting ChimeraDev Application (Frontend & Backend) 🔥"

# Jalankan Backend (Port 8001) di background
# Kita pakai yarn start (yang mengacu ke 'node server.js' di backend/package.json)
echo "Starting Backend Server (Port 8001)..."
(
    cd "$ROOT_DIR/backend" || exit 1
    yarn start &
)
BACKEND_PID=$! # Simpan Process ID backend

# Jalankan Frontend (Port 3001) di background
# Kita pakai yarn dev (yang mengacu ke 'vite' di package.json root)
echo "Starting Frontend Vite (Port 3001)..."
yarn dev &
FRONTEND_PID=$! # Simpan Process ID frontend

# Tunggu sampai kedua proses selesai (atau di-stop oleh user)
echo ""
echo "App is running! Access Frontend at http://localhost:3001"
echo "Press Ctrl+C to stop both servers."

# Trap untuk menghentikan kedua proses jika Ctrl+C ditekan
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Menunggu kedua proses yang dijalankan di background
wait