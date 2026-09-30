---
name: versiones
description: Exporta el mismo video en varios formatos (vertical 9:16, cuadrado 1:1, horizontal 16:9) para distintas redes. Úsala cuando el usuario quiera el video para YouTube, feed, LinkedIn, anuncios, varias redes o "en todos los formatos".
---

# Varias versiones

La edición (cortes, subtítulos, animaciones) es la misma; solo cambia el tamaño del video.

| Formato | Tamaño | Dónde |
|---|---|---|
| `vertical` | 1080×1920 (9:16) | Reels, TikTok, Shorts, Stories, anuncios verticales |
| `cuadrado` | 1080×1080 (1:1) | Feed de Instagram y Facebook, LinkedIn, anuncios de feed |
| `horizontal` | 1920×1080 (16:9) | YouTube, web, presentaciones |

## Encuadre

Cuando el video grabado no tiene la misma forma que la versión (por ejemplo, grabado en
vertical y exportado en horizontal), elige cómo rellenar:

- `llenar`: recorta los bordes. Bien si la cara queda centrada y no se pierde nada importante.
- `ajustar`: se ve todo el video, con barras negras.
- `desenfocado`: se ve todo el video sobre una copia ampliada y borrosa. **Es la opción
  recomendada** para pasar de vertical a horizontal o cuadrado.

## Pasos

1. `npm run revisar`.
2. Exporta primero una muestra de cada versión nueva para revisar la composición:
   `npm run exportar -- --formato horizontal --encuadre desenfocado --muestra`
3. Revisa que los títulos, el logo, los emojis y los subtítulos no se salgan ni tapen la cara.
   En horizontal hay menos altura: si los subtítulos tapan algo, baja `posicionVertical`
   (por ejemplo, a 0.8) **solo para esa versión**; guarda antes una copia de la edición en
   `proyecto/versiones/` y restáurala después.
4. Exporta todas: `npm run versiones -- vertical cuadrado horizontal --encuadre desenfocado`
   (o solo las que pida). Cada una tarda aproximadamente lo mismo que un video completo.

Los archivos quedan en `entregas/` con el formato en el nombre
(`mi-video-cuadrado-final-...mp4`). Dile cuál subir a cada red.
