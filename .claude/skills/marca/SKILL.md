---
name: marca
description: Crea o cambia el kit de marca del usuario (colores, logo, marca de agua, música, llamado a la acción) y lo aplica solo a todos sus videos. Úsala cuando el usuario hable de su marca, colores de marca, logo, identidad, estilo fijo o quiera que todos sus videos se vean iguales.
---

# Kit de marca

La marca vive en **`proyecto/marca.json`** y se aplica sola a cada video nuevo
(`npm run preparar`). Para aplicarla al video actual: `npm run marca`.

## 1. Entrevista (un solo mensaje)

Si `configurada` es `false`, pregunta en un solo mensaje:

1. Nombre de la marca y usuario de redes (por ejemplo, `@millonariosconscientes`).
2. Color principal (el de resaltado y fondo de los títulos). Acepta un nombre ("verde
   esmeralda"), un código (`#00E676`) o una captura del logo: si te da una imagen, extrae el
   color y confírmalo.
3. Logo en PNG, mejor con fondo transparente: que lo copie a `public/imagenes/`.
   ¿Lo quiere siempre visible en una esquina (marca de agua)?
4. Llamado a la acción habitual ("Sígueme para más", "Escríbeme INFO por DM", etc.).
5. ¿Música de fondo fija? (archivo en `public/musica/`, solo si tiene derechos).
6. Estilo en pocas palabras (serio, enérgico, elegante, divertido…).

Lo que no conteste se queda con el valor por defecto.

## 2. Rellena `proyecto/marca.json`

| Campo | Qué es |
|---|---|
| `configurada` | Ponlo en `true` al terminar |
| `nombre`, `usuario` | Nombre y @ de redes |
| `estilo` | Descripción corta; úsala para decidir animaciones y textos |
| `colorPrincipal` | Palabra resaltada del subtítulo, fondo de los títulos y barra de progreso |
| `colorTextoSobrePrincipal` | Texto de los títulos: oscuro (`#111111`) sobre colores claros, blanco sobre oscuros |
| `colorSubtitulos`, `colorBorde` | Subtítulo normal y su borde (blanco con borde negro se lee en cualquier fondo) |
| `logo` | Nombre del archivo en `public/imagenes/` |
| `logoComoMarcaDeAgua`, `esquinaLogo` | Logo fijo en `arriba-izquierda`, `arriba-derecha`, `abajo-izquierda` o `abajo-derecha` |
| `llamadoAccion` | Texto del CTA final (úsalo en `/animar-video`) |
| `musica`, `volumenMusica` | Música fija (0.05-0.12) |
| `sonidos` | `true` para efectos de sonido automáticos |
| `barraProgreso` | Barra superior del color principal |
| `subtitulos` | `tamano`, `posicionVertical`, `mayusculas` y `msPorPagina` por defecto |

Comprueba el contraste: si el color principal es claro (amarillo, verde lima, cian), el texto
de los títulos debe ser oscuro.

## 3. Aplica y muestra

1. Si hay un video cargado: `npm run marca` y luego `npm run revisar`.
2. Exporta una muestra (`npm run exportar -- --muestra`) para que vea los colores y el logo.
3. Resume la marca en una tabla y recuérdale que se aplicará sola a sus próximos videos.

Si el logo tapa la cara o los títulos, cambia `esquinaLogo`. En Reels y TikTok los botones
(me gusta, comentar, compartir) ocupan la parte derecha de abajo: evita `abajo-derecha`.
