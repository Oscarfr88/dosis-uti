#!/bin/bash
# Doble clic para regenerar dist/InfusionesUTI.html (el archivo para compartir)
# después de cualquier cambio en drogas o código.
cd "$(dirname "$0")"
/usr/bin/python3 scripts/build.py
echo ""
echo "Archivo listo para compartir: dist/InfusionesUTI.html"
read -p "Presioná Enter para cerrar..."
