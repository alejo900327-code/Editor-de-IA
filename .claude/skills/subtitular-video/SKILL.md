---
name: subtitular-video
description: Pone, corrige o cambia el estilo de los subtítulos (palabra resaltada tipo TikTok). Úsala cuando el usuario hable de subtítulos, captions, texto de lo que dice, letra, color, tamaño o posición del texto.
---

# Subtítulos

Los subtítulos se generan solos a partir de `proyecto/transcripcion.json` y siguen los
cortes automáticamente. El estilo está en `subtitulos` dentro de `proyecto/edicion.json`.

## Si no hay transcripción

Ejecuta `npm run transcribir`. Para voces difíciles, acentos marcados o mucho ruido,
ofrece `npm run transcribir -- --modelo medium` (más preciso, más lento, descarga 1.5 GB).

## Corregir palabras

1. Lee `proyecto/transcripcion.txt` y revisa sobre todo nombres propios, marcas, cifras y
   palabras técnicas. Ejemplo: "Millonarios Concientes" -> "Millonarios Conscientes".
2. Corrige en `proyecto/transcripcion.json` solo el campo `text` de esa palabra. Conserva
   el espacio inicial (`" Conscientes"`) y **no cambies los tiempos**.
3. Si una palabra dudosa puede ser dos cosas, pregunta al usuario; no adivines.
4. Para quitar una palabra solo del subtítulo (no del audio), borra su objeto del JSON.

## Estilo

Cambia en `subtitulos`:

| Pedido del usuario | Qué cambiar |
|---|---|
| más grande / más pequeño | `tamano` (60-90 es lo normal en vertical) |
| más arriba / más abajo | `posicionVertical` (0.5 centro, 0.7 recomendado, más de 0.8 lo tapan los botones de la app) |
| color de marca | `colorResaltado` (la palabra que se está diciendo) y/o `color` |
| menos o más palabras a la vez | `msPorPagina` (600 = 1-2 palabras, 900 = 2-4, 1400 = frases) |
| sin mayúsculas | `mayusculas: false` |
| quitar subtítulos | `activos: false` |

Los colores van en formato hexadecimal (`#FF0055`). Si el usuario da un nombre ("rojo
de mi marca"), propón un código y confírmalo.

Si el video tiene títulos o imágenes en la zona de los subtítulos, sepáralos: sube el título
(`posicion: "arriba"`) en vez de mover los subtítulos encima de la cara.

## Comprueba

`npm run revisar` y después una muestra con una frase larga:
`npm run exportar -- --muestra <segundo>`. Revisa que no tape la cara, que se lea en el
móvil y que vaya al ritmo de la voz.
