#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== WellLogAI başladılır ==="

# Backend
cd "$ROOT/backend"
if [ ! -f .env ]; then
  echo "XƏTA: backend/.env faylı tapılmadı."
  echo "backend/.env.example faylını kopyala və ANTHROPIC_API_KEY-i daxil et:"
  echo "  cp backend/.env.example backend/.env"
  exit 1
fi
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "Backend başladı (PID: $BACKEND_PID)"

# Frontend
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
echo "Frontend başladı (PID: $FRONTEND_PID)"

echo ""
echo "✅ App açıqdır: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo ""
echo "Dayandırmaq üçün: Ctrl+C"

wait
