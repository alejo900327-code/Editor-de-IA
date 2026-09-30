---
name: broll
description: Agrega b-roll (imágenes o clips de apoyo) sobre el video según lo que se dice, con material propio o descargado gratis de Pexels. Úsala cuando el usuario pida b-roll, imágenes de apoyo, clips, tomas de recurso, ilustrar lo que dice o hacer el video más visual.
---

# B-roll

El b-roll son imágenes o clips que tapan un momento al presentador para ilustrar lo que dice.
Los archivos van en `public/broll/` y se usan con animaciones de tipo `broll`:

```json
{"tipo": "broll", "en": 12.4, "duracion": 2.5, "archivo": "dinero-1.mp4", "modo": "completo"}
```

- `modo: "completo"`: ocupa toda la pantalla (los subtítulos siguen encima).
- `modo: "ventana"`: un recuadro en la parte de arriba y el presentador sigue visible abajo.
  Es mejor cuando la cara importa.
- Las fotos llevan un acercamiento lento automático. Los clips van sin sonido.

## 1. Elige los momentos

Lee `proyecto/transcripcion.txt` y elige frases **concretas y visuales** ("mi primer
cliente", "gastaba todo en ropa", "el mercado cayó"). Las ideas abstractas funcionan mejor
con un `titulo`. Pautas:

- 1.5 a 3 segundos cada uno, como mucho uno cada 5-8 segundos.
- Nunca en los primeros 2 segundos: el gancho es la cara del presentador.
- Nunca durante el llamado a la acción final.

Muestra la propuesta en una tabla (segundo, frase, qué buscar, modo) antes de descargar nada.

## 2. Consigue el material

**Material propio (mejor):** pídele que copie sus fotos o clips a `public/broll/`.

**Pexels (gratis):** `npm run broll -- "<búsqueda>" --tipo foto|video --cantidad 3 --nombre <nombre-corto>`

- La primera vez necesita una clave gratuita: que se registre en https://www.pexels.com/api/
  y guarde la clave en un archivo `.env` en la carpeta del proyecto:
  `PEXELS_API_KEY=su_clave` (hay un ejemplo en `.env.ejemplo`). No la pegues en el chat ni la subas a GitHub.
- Busca **en inglés** con 2-4 palabras concretas ("man counting money", "stock market
  screen"): da mejores resultados.
- Por defecto busca material vertical; para videos horizontales añade `--orientacion landscape`.
- Descarga 2-3 opciones y elige la que mejor encaje. Si puedes ver imágenes, mira las fotos
  antes de elegir. Los clips que no uses, bórralos.

## 3. Aplica y comprueba

1. Añade las animaciones `broll` en `proyecto/edicion.json`.
2. `npm run revisar`.
3. Exporta una muestra que incluya un b-roll: `npm run exportar -- --muestra <segundo>`.

Pexels no exige atribución, pero los créditos quedan en `public/broll/CREDITOS.txt`.
No uses imágenes de Google ni de otras redes: pueden tener derechos de autor.
