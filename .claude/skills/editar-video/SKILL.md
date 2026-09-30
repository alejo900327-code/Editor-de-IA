---
name: editar-video
description: Edita un video hablado de principio a fin (cortes, subtítulos y animaciones) y lo exporta. Úsala cuando el usuario quiera editar un video nuevo o no sepa por dónde empezar.
---

# Editar un video completo

Sigue estas etapas en orden. Al terminar cada una di qué hiciste y qué viene después.
Si el usuario ya indicó algo (formato, estilo, destino), no se lo vuelvas a preguntar.

## 0. Briefing corto

Si no lo sabes aún, pregunta **en un solo mensaje**:

1. ¿Dónde está el video? (puede arrastrar el archivo al chat o darte la ruta)
2. ¿Para qué red es? (Reels/TikTok/Shorts = vertical, YouTube = horizontal)
3. ¿Qué quieres lograr con el video y a quién va dirigido?
4. ¿Tienes logo, imágenes o música para usar? (van en `public/imagenes` y `public/musica`)
5. ¿Colores de marca? (si no, usa blanco con resaltado amarillo)

Si falta algo que no es esencial, usa el valor por defecto y díselo.

## 1. Preparar y transcribir

1. Si `node_modules` no existe, sigue antes la skill `/instalar-editor`.
2. `npm run preparar -- "<ruta del video>" --formato <vertical|horizontal|cuadrado>`
3. `npm run transcribir` (la primera vez descarga Whisper: avisa que tarda).
4. Lee `proyecto/transcripcion.txt` y muestra al usuario un resumen de lo que dice el video.
   Señala las palabras dudosas (nombres, marcas, cifras) y corrígelas en
   `proyecto/transcripcion.json` según te diga.

## 2. Cortes

Aplica la skill `/cortar-video`: silencios automáticos y luego muletillas y tomas repetidas.

## 3. Subtítulos

Aplica la skill `/subtitular-video` con el estilo del briefing.

## 4. Animaciones

Aplica la skill `/animar-video`: propón primero la lista de animaciones (frase -> efecto) y
aplícala cuando el usuario diga que sí.

## 5. Muestra y exportación

Aplica la skill `/exportar-video`: primero la muestra de 8 segundos y, con la aprobación,
el video completo.

## Reglas

- Ejecuta `npm run revisar` después de cada cambio en `proyecto/edicion.json`.
- Guarda una copia en `proyecto/versiones/` antes de cada etapa.
- No inventes texto, cifras ni promesas que no estén en la grabación.
