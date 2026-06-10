#!/bin/bash
# Doble clic en este archivo para iniciar la app.
# Levanta un servidor local con Python (incluido en macOS) y abre el navegador.
cd "$(dirname "$0")"
PORT=8743
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
echo "════════════════════════════════════════════════════"
echo "  💉 Infusiones UTI"
echo ""
echo "  En esta Mac:      http://localhost:$PORT"
if [ -n "$IP" ]; then
  echo "  Desde el celular: http://$IP:$PORT"
  echo "  (el celular debe estar en la misma red WiFi)"
fi
echo ""
echo "  Ctrl+C para detener el servidor."
echo "════════════════════════════════════════════════════"
( sleep 1 && open "http://localhost:$PORT" ) &
exec /usr/bin/python3 -m http.server "$PORT"
