---
name: exportar-video
description: Exporta el video editado a MP4 - primero una muestra de 8 segundos y luego el video completo. Úsala cuando el usuario quiera ver el resultado, descargar, renderizar, exportar o terminar el video.
---

# Exportar

## 1. Revisa antes de exportar

Ejecuta `npm run revisar`. Si hay ERROR, corrígelo primero.

## 2. Muestra de 8 segundos

`npm run exportar -- --muestra <segundo>`, donde `<segundo>` es un momento del video
**final** que incluya una frase larga con subtítulos y, si la hay, una animación
(sin número = desde el principio).

Dile al usuario la ruta del archivo en `entregas/` y pídele que lo vea **en el móvil y con
sonido**. Pregunta: ¿se lee bien el subtítulo?, ¿la cara se ve completa?, ¿los cortes
suenan naturales?

Para cambios pequeños también puede usar `npm run estudio` (vista previa en
http://localhost:3000, se actualiza sola cada vez que cambias la edición).

## 3. Video completo

Con la muestra aprobada: `npm run exportar`. Tarda aproximadamente entre 1 y 3 veces la
duración del video. El archivo queda en `entregas/` con la fecha en el nombre, así que no
reemplaza versiones anteriores.

El MP4 sale en H.264 con audio AAC, válido para Instagram, TikTok, YouTube y WhatsApp.

## 4. Cierre

Resume: duración final, cortes, subtítulos, animaciones y la ruta del archivo. Guarda la
edición aprobada en `proyecto/versiones/final-<fecha>.json`.

Si el usuario quiere otra versión (por ejemplo, horizontal para YouTube), copia la edición,
cambia `formato` (1920x1080) y revisa que los títulos y subtítulos sigan en buen lugar
antes de exportar.
