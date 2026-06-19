# CapCup Frontend — Tareas pendientes

Estado actual: React + Vite + TypeScript. Sube video/audio, muestra transcripcion, overlay de subtitulos con estilo/emojis automaticos, y un timeline visual (pista de medio + pista de subtitulos) de solo lectura.

## Prioridad alta

- [ ] **Edicion de subtitulos**: permitir click en un segmento de la transcripcion y editar el texto/tiempos directamente desde el panel, llamando al `PATCH /videos/{id}/transcript` del backend (ver TASKS.md del backend).
- [ ] **Estado de progreso real**: hoy el spinner es generico ("Detectando voz..."). Si el backend agrega progreso (websocket o polling), mostrar barra de progreso real.
- [ ] **Manejo de archivos grandes**: agregar validacion de tamano en el input antes de subir (evitar que el usuario espere un upload que el backend va a rechazar).
- [x] **Exportar video final**: boton "Exportar" que llame al endpoint de export del backend y descargue el video con subtitulos quemados.
- [ ] **Persistir el proyecto entre recargas**: si el usuario refresca la pagina pierde el video cargado. Guardar `video_id` en localStorage y permitir recuperarlo.

## Prioridad media

- [ ] **Timeline editable**: hoy el timeline (`TrackTimeline.tsx`) es de solo lectura (click para saltar). Agregar:
  - Arrastrar los bordes de un bloque de subtitulo para ajustar `start`/`end`.
  - Zoom in/out del timeline para videos largos.
- [ ] **Multi-clip**: soportar subir varios videos/audios y ordenarlos en la misma pista (requiere rediseño de estado: lista de clips en vez de un solo `videoId`).
- [ ] **Personalizacion de estilo de subtitulos**: hoy el estilo (color, mayusculas, emojis) es 100% automatico por heuristica (`captionStyle.ts`). Agregar un panel opcional para elegir fuente/color/animacion, con el modo automatico como default.
- [ ] **Detectar y resaltar silencios en el timeline**: una vez el backend tenga `silencedetect`, mostrar esos rangos visualmente y permitir "auto-cut" con un click.
- [ ] **Loading states mas claros por paso**: distinguir visualmente "subiendo archivo" vs "transcribiendo" con barras de progreso separadas en vez de solo texto.

## Prioridad baja / nice-to-have

- [ ] **Atajos de teclado**: espacio para play/pause, flechas para saltar entre segmentos (estandar en editores de video).
- [ ] **Modo claro/oscuro**: actualmente solo hay tema oscuro fijo.
- [ ] **Internacionalizacion**: textos estan hardcodeados en espanol; extraer a un archivo de strings si se necesita soporte multi-idioma de UI.
- [ ] **Tests E2E con Playwright**: ya se usa Playwright para QA manual en este proyecto; formalizar un flujo E2E (subir -> transcribir -> ver subtitulos) como test automatizado en CI.

## Deuda tecnica

- [ ] `App.tsx` esta acumulando mucho estado y logica de upload/transcripcion; considerar extraer a un hook `useTranscription()` si crece mas.
- [ ] `captionStyle.ts` tiene un diccionario de emojis/keywords hardcodeado y pequeno; si se usa en produccion conviene ampliarlo o mover a un servicio de NLP mas robusto.
- [ ] Revisar accesibilidad: el input de archivo oculto y los bloques del timeline no tienen labels/aria para lectores de pantalla.
