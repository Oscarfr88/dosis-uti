#!/usr/bin/env python3
"""Genera los íconos PNG de la app (cruz blanca sobre azul oscuro) sin
dependencias externas — escribe el formato PNG a mano con zlib/struct."""
import struct
import zlib
import pathlib

BG = (15, 23, 42, 255)     # slate-900 (fondo de la app)
FG = (248, 250, 252, 255)  # blanco


def png(size, pixel_fn):
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filtro None por scanline
        for x in range(size):
            raw.extend(pixel_fn(x, y))

    def chunk(tag, data):
        return (
            struct.pack(">I", len(data)) + tag + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)  # RGBA 8 bit
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def make_icon(size):
    # Cruz médica centrada; proporciones con zona segura para iconos
    # enmascarables (Android los recorta en círculo).
    bar = size * 0.20
    arm = size * 0.58
    c = size / 2

    def px(x, y):
        dx, dy = abs(x + 0.5 - c), abs(y + 0.5 - c)
        inside = (dx <= bar / 2 and dy <= arm / 2) or (dy <= bar / 2 and dx <= arm / 2)
        return FG if inside else BG

    return png(size, px)


out = pathlib.Path(__file__).resolve().parent.parent / "icons"
out.mkdir(exist_ok=True)
for size, name in [(192, "icon-192.png"), (512, "icon-512.png"), (180, "icon-180.png")]:
    (out / name).write_bytes(make_icon(size))
    print(f"✓ icons/{name}")
