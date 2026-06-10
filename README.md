# 💉 Infusiones UTI

Calculadora bidireccional de drogas de infusión continua para Terapia
Intensiva, Anestesia y Urgencias. React + Tailwind CSS, 100% local y
**sin necesidad de internet** (las librerías están en `vendor/`).

## Cómo usarla

**Doble clic en `start.command`** — levanta un servidor local con Python
(incluido en macOS) y abre el navegador en `http://localhost:8743`.

> La primera vez, macOS puede pedir autorización: clic derecho sobre
> `start.command` → Abrir.

### Desde el celular

La terminal muestra una dirección del tipo `http://192.168.x.x:8743`:
abrila en el navegador del celular **conectado a la misma red WiFi** que
la Mac (el servidor debe quedar corriendo en la Mac). La interfaz es
responsive y está optimizada para pantallas táctiles.

## 🌐 App publicada (la forma recomendada de compartir)

**https://oscarfr88.github.io/dosis-uti/**

Ese link funciona en cualquier dispositivo. Para dejarla instalada como app:
- **iPhone**: abrir en Safari → botón Compartir → "Agregar a pantalla de inicio".
- **Android**: abrir en Chrome → menú ⋮ → "Agregar a pantalla principal".

Una vez abierta por primera vez, funciona **sin conexión** (service worker).
Para publicar cambios: editar el código, regenerar `dist/` con `build.command`,
subir el número de versión en `sw.js` (CACHE = 'infusiones-uti-vN') y hacer
`git add -A && git commit && git push`.

## Compartir con otros médicos (archivo autónomo)

`dist/InfusionesUTI.html` es la app completa en **un solo archivo** (~3,4 MB):
funciona sin internet, sin servidor y sin instalar nada. Se envía por
WhatsApp, mail o Drive y cada uno lo abre en el navegador de su dispositivo:

- **Android**: descargar el archivo y abrirlo con Chrome.
- **iPhone/iPad**: guardarlo en Archivos → mantener apretado → Compartir →
  Safari (la vista previa rápida puede no ejecutar la calculadora; hay que
  abrirlo con Safari).
- **PC/Mac**: doble clic.

Después de cualquier cambio en drogas o código, regenerarlo con doble clic
en `build.command`.

## Funcionalidad

- **Peso del paciente global y persistente** (se guarda entre sesiones,
  no se pierde al cambiar de categoría). Validado entre 1 y 300 kg.
- **5 categorías**: Vasopresores e Inotrópicos · Sedantes · Analgesia ·
  Bloqueantes Neuromusculares · Cardiovasculares (20 drogas).
- **Cálculo bidireccional** por droga:
  - *Dosis → ml/h*: ingreso la dosis deseada, obtengo el ritmo de bomba.
  - *ml/h → Dosis*: ingreso el ritmo actual, obtengo la dosis recibida.
- **Concentraciones estándar editables** con botón "↺ Estándar" para volver
  a la dilución de referencia.
- **Avisos de rango**: verde dentro del rango habitual, rojo por encima,
  celeste por debajo; bloqueo de resultados implausibles (>1500 ml/h).
- **Modo oscuro por defecto**, alto contraste, números grandes.

## Fórmula

```
ml/h = (dosis × peso × factor_tiempo) / concentración
```

- `factor_tiempo` = 60 si la dosis es "por minuto" (la bomba programa por hora).
- `peso` solo participa si la unidad incluye `/kg/` (la vasopresina, por
  ejemplo, se dosifica en UI/min fijas).
- `concentración` = masa total de droga / volumen total de la mezcla,
  convertida a la unidad de masa de la dosis (mg ↔ mcg).

## Estructura

```
dosis-uti/
├── index.html                  # punto de entrada
├── start.command               # lanzador de doble clic (macOS)
├── vendor/                     # React, ReactDOM, Babel, Tailwind (locales)
└── src/
    ├── App.jsx                 # estado global: peso, categoría, tema
    ├── utils/calculations.js   # lógica de cálculo PURA (testeable)
    ├── data/drugs.js           # vademécum: concentraciones y rangos
    └── components/
        ├── PatientPanel.jsx    # peso del paciente (persistente)
        ├── CategoryTabs.jsx    # navegación entre categorías
        ├── DrugCard.jsx        # tarjeta genérica de cálculo bidireccional
        └── Disclaimer.jsx      # descargo de responsabilidad
```

## ⚠️ Descargo de responsabilidad

Esta aplicación es una herramienta de apoyo. Todas las dosis y cálculos
deben ser verificados clínicamente por el profesional a cargo antes de su
administración. Las concentraciones precargadas son diluciones de
referencia y pueden no coincidir con el protocolo de su institución.
