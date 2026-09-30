---
name: animar-video
description: Agrega animaciones sincronizadas con lo que se dice - títulos que aparecen, imágenes o logos, zoom a la cara, música de fondo y barra de progreso. Úsala cuando el usuario pida animaciones, efectos, textos en pantalla, zoom, imágenes, logo, música o hacer el video más dinámico.
---

# Animaciones

Se definen en `animaciones` dentro de `proyecto/edicion.json`. Cada una empieza en `en`
(segundo del video **original**, tomado de la transcripción) y dura `duracion` segundos.

## Tipos disponibles

| Tipo | Para qué | Campos |
|---|---|---|
| `titulo` | Frase clave en grande (gancho, número, idea fuerza) | `texto`, `posicion`, `fondo`, `color` |
| `imagen` | Logo, captura, producto, gráfico | `archivo` (en `public/imagenes/`), `posicion`, `ancho` (% del ancho) |
| `zoom` | Acercamiento a la cara para enfatizar | `escala` (1.1 suave, 1.25 normal, 1.4 fuerte) |

Además: `musica` (archivo en `public/musica/`, `volumen` 0.05-0.12 para que no tape la voz)
y `barraProgreso: true`.

## Cómo proponerlas

1. Lee `proyecto/transcripcion.txt` y elige los momentos que lo merecen:
   - **Gancho** (primeros 3 segundos): un `titulo` con la promesa o pregunta principal.
   - **Números, listas y palabras clave**: `titulo` corto (máximo 4-5 palabras).
   - **Frases de énfasis** ("esto es lo más importante"): `zoom` de 1.5-2.5 s.
   - **Menciones a un producto, marca o web**: `imagen`, si el usuario tiene el archivo.
   - **Llamado a la acción al final**: `titulo` con la acción real que dice el video.
2. Muestra la propuesta como tabla antes de aplicarla:

   | Seg. | Frase | Efecto |
   |---|---|---|
   | 0.5 | "3 errores que te hacen perder dinero" | título "3 ERRORES" arriba |

3. Aplica cuando el usuario apruebe. Si te pidió que decidas tú, aplícala directamente.

## Reglas de buen gusto

- Una cosa a la vez: no juntes título, imagen y zoom en el mismo momento.
- Como máximo una animación cada 3-5 segundos; si todo destaca, nada destaca.
- Títulos arriba (`posicion: "arriba"`) para no chocar con los subtítulos ni con la cara.
- Usa solo imágenes y música que el usuario tenga derecho a usar. No inventes cifras, precios
  ni promesas en los títulos: copia lo que dice el video.
- Si el usuario quiere un efecto que no existe (por ejemplo, un emoji animado, una flecha o
  una transición), puedes crear un componente nuevo en `src/componentes/` usando
  `useCurrentFrame`, `interpolate` y `spring` de Remotion (nunca animaciones CSS), añadir su
  tipo en `src/edicion.ts` y en `scripts/verificar.mjs`, y documentarlo en `CLAUDE.md`.

## Comprueba

`npm run revisar` y después una muestra que incluya una animación:
`npm run exportar -- --muestra <segundo>`.
