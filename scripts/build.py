#!/usr/bin/env python3
"""Empaqueta la app completa en un único HTML autónomo (dist/InfusionesUTI.html).

Inlinea todos los <script src="..."> (vendor y código propio) dentro del HTML,
de modo que el archivo resultante funcione abierto directamente desde el
navegador de cualquier dispositivo, sin servidor y sin internet.
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "InfusionesUTI.html"

html = (ROOT / "index.html").read_text(encoding="utf-8")

def inline_script(match):
    before, src, after = match.group(1), match.group(2), match.group(3)
    code = (ROOT / src).read_text(encoding="utf-8")
    # '</script' dentro del JS cortaría el tag; '<\/script' es equivalente en
    # strings/regex de JS y es el escape estándar para inlinear.
    code = code.replace("</script", r"<\/script")
    return f"<script{before}{after}>\n{code}\n</script>"

html, n = re.subn(
    r'<script([^>]*?)\s+src="([^"]+)"([^>]*)></script>',
    inline_script,
    html,
)

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html, encoding="utf-8")
size_mb = OUT.stat().st_size / 1024 / 1024
print(f"✓ {n} scripts inlineados → {OUT}  ({size_mb:.1f} MB)")
