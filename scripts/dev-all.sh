#!/bin/sh
set -e

ROOT_DIR="/home/esteban/Escritorio/portfolio"
GESTION_DIR="$ROOT_DIR/public/proyectos/gestion_peluqueria"

if [ ! -d "$GESTION_DIR" ]; then
  echo "No se encuentra gestion_peluqueria en: $GESTION_DIR"
  exit 1
fi

cleanup() {
  if [ -n "$P1" ]; then kill "$P1" 2>/dev/null || true; fi
  if [ -n "$P2" ]; then kill "$P2" 2>/dev/null || true; fi
}

trap cleanup INT TERM EXIT

cd "$ROOT_DIR"

npm run dev &
P1=$!

cd "$GESTION_DIR"
./start.sh &
P2=$!

wait $P1 $P2
