---
name: cortar-video
description: Hace los cortes de un video hablado - quita silencios, muletillas, tomas repetidas o los tramos que el usuario pida. Úsala cuando el usuario diga cortar, recortar, quitar silencios, acortar, quitar errores o dejar el video más dinámico.
---

# Cortar el video

Los cortes viven en `proyecto/edicion.json`, en `cortes`: la lista de tramos que **se
conservan**, en segundos del video original, en orden y sin superponerse.
Guarda una copia en `proyecto/versiones/` antes de empezar.

## 1. Silencios (automático)

Si hay transcripción (`proyecto/transcripcion.json` no está vacío), ejecuta `npm run cortes`.

- Ritmo normal: `--silencio 0.6` (por defecto).
- Ritmo más rápido tipo TikTok: `--silencio 0.35 --margen 0.1`.
- Si el usuario nota que se "comen" el principio o el final de las palabras, sube `--margen` a 0.2.

## 2. Muletillas, errores y tomas repetidas (con criterio)

Lee `proyecto/transcripcion.txt` y busca:

- Frases repetidas o reiniciadas ("hoy vamos... hoy vamos a ver"): conserva **la última
  toma completa**, que suele ser la buena.
- Muletillas sueltas: "eh", "em", "este", "o sea", "¿vale?", "¿me explico?" cuando no aportan nada.
- Inicios y finales muertos (antes de la primera frase y después de la última).

Para quitar algo, parte o acorta el tramo correspondiente de `cortes` usando los tiempos
de cada palabra en `proyecto/transcripcion.json` (`startMs` y `endMs`, en milisegundos).
Deja unos 0.1 s de margen para que no suene cortado.

**Antes de aplicarlo**, muestra la lista de lo que vas a quitar:

```
1. [12.40-14.10] "hoy vamos... " (toma repetida)
2. [31.20-31.60] "eh"
```

Aplica cuando el usuario apruebe (o directamente si ya te pidió que decidieras tú).

## 3. Cortes que pide el usuario

"Quita desde 'bueno, entonces' hasta 'lo importante'": busca esas frases en la transcripción
y usa sus tiempos. Si una frase aparece varias veces, pregunta cuál.

## 4. Comprueba

1. `npm run revisar` (debe decir "Todo en orden").
2. Di cuánto duraba y cuánto dura ahora, y cuántos cortes hay.
3. Sugiere revisarlo en `npm run estudio` o exportar una muestra, sobre todo en los cortes
   de muletillas, que son los más delicados.

Si un corte suena brusco, amplía el tramo 0.1 s en el lado que corresponda en vez de rehacer
todos los cortes.
