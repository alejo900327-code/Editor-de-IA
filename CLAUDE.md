# Editor de video con IA (Claude Code + Remotion)

Este proyecto edita videos cortos hablados (reels, TikTok, shorts, anuncios) a partir de
instrucciones en español. El usuario suele ser principiante: explica en lenguaje simple,
sin jerga, y dile siempre cuál es el siguiente paso.

## Cómo funciona

- Toda la edición vive en **`proyecto/edicion.json`**. Para editar, cambia ese archivo;
  no toques el código de `src/` salvo que el usuario pida un efecto nuevo.
- Todos los tiempos de `edicion.json` están en **segundos del video ORIGINAL**
  (los mismos de `proyecto/transcripcion.txt`). El programa los traslada solo al video
  final después de los cortes. Nunca calcules tiempos del video final a mano.
- `proyecto/transcripcion.txt`: la transcripción con tiempos, una frase por línea.
  Léela antes de decidir cortes, subtítulos o animaciones.
- `proyecto/transcripcion.json`: cada palabra con su tiempo. Para corregir una palabra mal
  transcrita, cambia solo su `text` (conserva el espacio inicial) y no toques los tiempos.
- Archivos del usuario: videos en `public/videos/`, imágenes en `public/imagenes/`,
  música en `public/musica/`. Los videos exportados quedan en `entregas/`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run preparar -- "ruta/video.mp4" [--formato vertical\|horizontal\|cuadrado]` | Carga un video nuevo (guarda el proyecto anterior en `proyecto/historial/`) |
| `npm run transcribir [-- --modelo small\|medium]` | Transcribe con Whisper en local (gratis) |
| `npm run cortes [-- --silencio 0.6 --margen 0.15]` | Quita los silencios automáticamente |
| `npm run revisar` | Revisa el código y `edicion.json`: ejecútalo después de CADA cambio |
| `npm run estudio` | Abre la vista previa en el navegador (http://localhost:3000) |
| `npm run exportar -- --muestra [segundo]` | Exporta 8 segundos de prueba |
| `npm run exportar` | Exporta el video completo a `entregas/` |

## Formato de `edicion.json`

```jsonc
{
  "video": "mi-video.mp4",            // archivo dentro de public/videos/
  "duracionOriginal": 42.5,
  "formato": {"ancho": 1080, "alto": 1920, "fps": 30},
  "encuadre": "llenar",               // "llenar" (recorta los bordes) o "ajustar" (con barras negras)
  "volumenVoz": 1,
  "cortes": [                         // tramos del original que SE CONSERVAN, en orden y sin superponerse
    {"desde": 0.4, "hasta": 6.2},
    {"desde": 7.1, "hasta": 15.8}
  ],
  "subtitulos": {
    "activos": true, "fuente": "Montserrat", "tamano": 72,
    "color": "#FFFFFF", "colorResaltado": "#FFD400", "borde": "#000000",
    "posicionVertical": 0.7,          // 0 = arriba, 1 = abajo; 0.7 queda sobre los botones de la app
    "mayusculas": true,
    "msPorPagina": 900                // más alto = más palabras por subtítulo
  },
  "animaciones": [
    {"tipo": "titulo", "en": 3.2, "duracion": 2.5, "texto": "3 ERRORES", "posicion": "arriba", "fondo": "#FFD400", "color": "#111111"},
    {"tipo": "imagen", "en": 8.0, "duracion": 3, "archivo": "logo.png", "posicion": "arriba", "ancho": 60},
    {"tipo": "zoom", "en": 12.4, "duracion": 2, "escala": 1.25}
  ],
  "musica": {"archivo": null, "volumen": 0.08},   // archivo dentro de public/musica/
  "barraProgreso": false
}
```

`posicion` puede ser `arriba`, `centro` o `abajo`. `en` es el segundo del original donde
empieza la animación (búscalo en la transcripción) y `duracion` son segundos en pantalla.

## Reglas de trabajo

1. Antes de un cambio grande, copia `proyecto/edicion.json` a
   `proyecto/versiones/v<N>-<descripcion>.json` para poder volver atrás.
2. Después de cada cambio ejecuta `npm run revisar` y corrige cualquier ERROR.
3. No inventes lo que dice el video: usa la transcripción real. Si una palabra es dudosa
   (nombres, marcas, cifras), pregúntale al usuario.
4. Antes del video completo exporta una muestra de 8 segundos y espera la aprobación del usuario.
5. No uses servicios de pago ni instales programas globales sin preguntar.
6. No borres nunca los videos originales del usuario.
7. Al terminar cada paso di qué cambió, dónde verlo (`npm run estudio` o el archivo
   exportado) y cuál es el siguiente paso.

## Skills del proyecto

`/instalar-editor`, `/editar-video` (todo el proceso), `/cortar-video`, `/subtitular-video`,
`/animar-video` y `/exportar-video`.
