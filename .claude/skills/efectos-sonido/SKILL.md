---
name: efectos-sonido
description: Agrega efectos de sonido (pop, whoosh, ding, impacto) sincronizados con títulos, zooms, emojis, b-roll o frases concretas. Úsala cuando el usuario pida sonidos, efectos de sonido, SFX, que el video "suene" editado, o quite o baje los sonidos.
---

# Efectos de sonido

Los sonidos están en `public/sonidos/` (hechos para este kit, sin derechos de terceros):

| Archivo | Uso típico |
|---|---|
| `pop.wav` | Aparece un título, una imagen o un emoji |
| `whoosh.wav` | Zoom, b-roll, cambio de escena |
| `ding.wav` | Logro, número importante, "correcto" |
| `impacto.wav` | Revelación, frase fuerte, dato que sorprende |

El usuario puede añadir los suyos (`.wav` o `.mp3`) a esa carpeta, solo si tiene derecho a usarlos.

## Sonidos automáticos

En `proyecto/edicion.json`, el bloque `sonidos` pone un sonido cada vez que aparece una animación:

```json
"sonidos": {"activos": true, "volumen": 0.5, "alTitulo": "pop.wav", "alZoom": "whoosh.wav", "alEmoji": "pop.wav", "alBroll": "whoosh.wav"}
```

- Quitar todos: `activos: false`.
- Quitar solo uno (por ejemplo, los del zoom): `"alZoom": null`.
- Más bajos o más altos: `volumen` (0.3 discreto, 0.5 normal, 0.8 fuerte). Deben
  acompañar, nunca tapar la voz.

## Sonidos en una frase concreta

Añade a `animaciones` una entrada de tipo `sonido` en el segundo del original (tómalo de
`proyecto/transcripcion.txt`):

```json
{"tipo": "sonido", "en": 14.2, "archivo": "impacto.wav", "volumen": 0.6}
```

## Criterio

- Menos es más: un efecto cada 3-5 segundos como máximo.
- Dentro de un mismo video, cada sonido con una sola función (pop = aparece algo, whoosh = movimiento).
- En videos serios o de temas delicados, ofrece `volumen` 0.3 o desactivarlos.
- Si hay música, comprueba en la muestra que la voz se sigue entendiendo.

Al terminar: `npm run revisar` y una muestra (`npm run exportar -- --muestra <segundo>`).
Pídele que la escuche **con sonido**.
