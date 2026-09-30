#!/usr/bin/env bash
# Copia la suite video-ia-* a un proyecto concreto (para compartirla o versionarla).
# Uso: ./instalar-skills-video-ia.sh ~/Videos-IA
set -euo pipefail
DEST="${1:?Uso: $0 /ruta/al/proyecto}"
SRC="$HOME/.claude/skills"
mkdir -p "$DEST/.claude/skills"
for d in "$SRC"/video-ia-*/; do
  cp -R "$d" "$DEST/.claude/skills/"
  echo "  + $(basename "$d")"
done
echo "Listo en $DEST/.claude/skills"
