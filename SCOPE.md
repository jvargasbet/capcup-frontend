# CapCup — Documento de alcance vs. CapCut

Este documento describe las funcionalidades reales de CapCut (la referencia de producto) y compara contra el estado actual de CapCup, para servir de mapa de lo que falta construir.

Fuentes consultadas:
- [CapCut Desktop Pro 2026 — Flowith Blog](https://flowith.io/blog/capcut-desktop-pro-2026-professional-short-form-video-accessible-billion-creators/)
- [CapCut Complete Guide 2026 — BIGVU](https://bigvu.tv/blog/capcut-complete-guide-2026-download-templates-pricing-when-switch/)
- [CapCut Desktop Review 2026 — BIGVU](https://bigvu.tv/blog/capcut-online-desktop-editor-review/)
- [CapCut AI Features: Complete Guide & Review (2026)](https://freeacademy.ai/blog/capcut-ai-features-complete-guide-review-2026)
- [CapCut Standard vs Pro](https://www.capcut.com/resource/capcut-standard-vs-pro)
- [CapCut for PC & Mac: Desktop Tutorial — Primal Video](https://primalvideo.com/video-creation/editing/capcut-for-pc-mac-tutorial/)
- [Master CapCut Timeline Settings — Filmora/Wondershare](https://filmora.wondershare.com/advanced-video-editing/capcut-timeline.html)
- [How to Add Captions/Subtitles in CapCut — GoTranscript](https://gotranscript.com/en/blog/add-captions-subtitles-capcut-export-srt)

---

## 1. Funcionalidades de CapCut (referencia completa)

### 1.1 Edicion base (timeline)
- Timeline multi-pista: video, audio, texto y stickers en capas independientes, sincronizadas.
- Cortar / dividir clips (split) en cualquier punto del timeline.
- Arrastrar y reordenar clips entre pistas.
- Recorte de bordes de clip (trim) arrastrando los extremos.
- Zoom in/out del timeline para trabajar con precision en clips largos o cortos.
- Keyframes (animacion de propiedades como posicion, escala, rotacion en el tiempo).
- Velocidad ajustable por clip (speed ramping: cámara lenta, acelerado, curvas de velocidad).
- Chroma key (fondo verde / quitar fondo).
- Eliminador de fondo con IA (sin pantalla verde).
- Estabilizacion de video.

### 1.2 Texto y subtitulos
- Agregar texto manual con control de fuente, tamano, color, contorno, sombra, animacion de entrada/salida.
- **Auto Captions**: transcripcion automatica del audio a subtitulos sincronizados.
- Edicion de cada linea de subtitulo (texto y tiempos) desde un panel lateral.
- Estilos predefinidos de subtitulos (burbujas, resaltado de palabra activa, mayusculas, etc.).
- Exportar subtitulos como archivo `.srt` independiente del video.

### 1.3 IA generativa
- **AI Auto-Edit**: subes material crudo, describes en texto lo que quieres, la IA elige los mejores segmentos, aplica transiciones y musica, y entrega un video editado.
- **Script-to-Video**: a partir de un guion de texto, la IA sugiere visuales, genera voz en off y arma un borrador de video.
- Voz en off generada por IA (text-to-speech).
- Generacion/sugerencia de musica de fondo segun el tono del video.

### 1.4 Efectos y recursos
- Mas de 50,000 plantillas, transiciones, filtros y motion graphics en la libreria.
- Transiciones entre clips (fade, deslizar, glitch, etc.).
- Filtros de color y ajustes (brillo, contraste, saturacion, curvas).
- Efectos visuales (particulas, distorsion, retro, lentes, etc.).
- Stickers y elementos graficos animados.
- Banco de musica y efectos de sonido libres de derechos.

### 1.5 Exportacion y publicacion
- Exportar en distintas resoluciones (hasta 4K en plan Pro, 1080p en free) y formatos.
- Configuracion de framerate, bitrate y codec.
- Compartir directo a redes sociales desde la app.
- Remocion de marca de agua (plan Pro).

### 1.6 Modelo de negocio
- Plan gratuito: edicion basica, multi-track, keyframes, chroma key, speed ramping, filtros, voz IA basica, banco de musica, export 1080p, plantillas gratuitas.
- Plan Pro (~$8-10 USD/mes): sin marca de agua, IA avanzada, mayor calidad de export, libreria completa de efectos/plantillas.

---

## 2. Estado actual de CapCup (lo que ya existe)

| Area | Estado |
|---|---|
| Subida de archivo | ✅ Video y audio (mp4, mov, webm, mkv, avi, mp3, wav, m4a, aac, ogg, flac) |
| Transcripcion automatica | ✅ Whisper (faster-whisper), deteccion de idioma, segmentos con timestamps |
| Persistencia de transcripcion | ✅ Cacheada en disco, idempotente |
| Subtitulos sobre el video | ✅ Overlay con palabra activa resaltada en tiempo real |
| Estilo automatico de subtitulos | ✅ Heuristica de palabras clave -> color + emoji (sin configuracion manual) |
| Edicion de subtitulos | ✅ Edicion inline del texto de cada segmento (doble click), persistida via PATCH |
| Timeline visual | ✅ Pista de medio + pista de subtitulos (solo lectura para clips, editable para subtitulos via panel) |
| Reproductor | ✅ Video o audio segun el archivo subido |
| Un solo clip por proyecto | ✅ (limitacion: no hay multi-clip) |

## 3. Brechas (lo que falta vs. CapCut)

| Funcionalidad CapCut | Existe en CapCup | Esfuerzo estimado |
|---|---|---|
| Multi-clip en una pista | No | Alto — requiere modelo de datos nuevo (lista de clips, no un solo `videoId`) |
| Cortar / dividir clips (split) | No | Medio |
| Recorte de bordes arrastrando | No | Medio |
| Transiciones entre clips | No | Alto |
| Filtros de color / ajustes | No | Medio |
| Velocidad ajustable (speed ramping) | No | Medio (ffmpeg) |
| Chroma key / quitar fondo IA | No | Alto (requiere modelo de segmentacion) |
| Estabilizacion | No | Alto (fuera de alcance realista a corto plazo) |
| Keyframes / animaciones de propiedades | No | Alto |
| Texto manual personalizable (mas alla de subtitulos auto) | No | Medio |
| Estilos predefinidos de subtitulos (burbujas, etc.) | Parcial (1 estilo automatico) | Bajo-medio — agregar variantes |
| Exportar `.srt` | No | Bajo |
| Exportar video con subtitulos quemados | Si | Medio (ffmpeg, ya en backlog) |
| AI Auto-Edit (descripcion -> edicion automatica) | No | Alto — requiere LLM + logica de seleccion de clips |
| Script-to-Video | No | Alto — fuera de alcance, es un producto distinto |
| Voz en off por IA (TTS) | No | Medio (integrar un servicio TTS) |
| Banco de musica/efectos | No | Bajo-medio (curar libreria + UI de seleccion) |
| Transiciones, stickers, motion graphics | No | Alto |
| Exportar en multiples resoluciones/codecs | No | Medio (ffmpeg) |
| Compartir directo a redes sociales | No | Medio-alto (APIs de cada plataforma, ej. YouTube Data API) |
| Deteccion automatica de silencios para auto-cut | No | Medio (ffmpeg silencedetect, ya en backlog) |

## 4. Recomendacion de ruta

CapCup hoy cubre bien el **nicho de subtitulado automatico con estilo IA** (que es justamente el feature mas usado/valorado de CapCut, "Auto Captions"). Replicar el editor completo de CapCut (multi-clip, transiciones, efectos, chroma key, etc.) es un proyecto de meses con un equipo, no una iteracion mas.

Ruta sugerida, en orden de impacto vs. esfuerzo:
1. ~~Exportar video con subtitulos quemados (cierra el ciclo: subir -> editar -> descargar listo para publicar).~~ Hecho.
2. Multi-clip basico (subir varios archivos, ordenarlos, transcripcion combinada).
3. Split/trim de clips en el timeline.
4. Exportar `.srt` (rapido, alto valor para creadores que editan en otra herramienta).
5. Recien despues evaluar features de IA generativa (auto-edit, TTS) o integraciones externas (YouTube).
