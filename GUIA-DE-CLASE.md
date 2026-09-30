# Guía de clase — Editar videos con Claude Code (solo para el profesor)

## Hoy, antes de la clase (imprescindible)

Haz el recorrido completo del `README.md` **en tu computadora** con un video tuyo de 30-60 s.
Lo más importante es comprobar que la transcripción (Whisper) funciona en tu sistema.

- [ ] Descargar el ZIP desde GitHub y descomprimirlo (como lo hará un alumno).
- [ ] `/instalar-editor` sin errores.
- [ ] `/editar-video` con tu video: transcripción, cortes, subtítulos y animaciones.
- [ ] Exportar la muestra y el video final, y verlos **en el móvil**.
- [ ] Anotar cuánto tardó cada paso en tu computadora (para avisar a los alumnos).
- [ ] Si puedes, probar en una Mac **y** en un Windows.
- [ ] Tener a mano un video de demostración ya grabado y un logo PNG.
- [ ] Pedir a los alumnos que traigan **Node.js y Claude Code ya instalados** (Pasos 1 y 2)
      y un video corto grabado. Es lo que más tiempo quita en clase.

## Agenda sugerida (90 min)

| Min | Bloque | Qué pasa |
|---|---|---|
| 0-10 | Por qué editar con IA | Enseña el antes y el después de un video editado con el kit |
| 10-25 | Instalación | Pasos 1-5 del README juntos; ayuda a quien se quede atascado |
| 25-40 | Demo en vivo | `/editar-video` con tu video, explicando cada etapa |
| 40-70 | Práctica | Cada alumno edita su video: cortes, subtítulos y una animación |
| 70-85 | Ajustes | Pedir cambios en lenguaje natural (colores, zoom, logo, música) |
| 85-90 | Cierre | Exportar, compartir resultados y siguientes pasos |

## Guion de la demo (para que se vea "magia")

1. `/editar-video` → arrastra el video al chat → "Es para Reels, quiero que se vea dinámico,
   colores amarillo y negro".
2. Mientras transcribe, explica qué es Whisper (gratis y local) y abre
   `proyecto/transcripcion.txt` cuando termine.
3. "Quita silencios y muletillas": enseña la duración de antes y la de después.
4. Abre la vista previa (`npm run estudio`) para que vean los subtítulos.
5. "Pon un título con el gancho al inicio y haz zoom cuando digo X".
6. Exporta la muestra de 8 segundos y reprodúcela.
7. Pide una corrección en vivo: "sube los subtítulos" o "el título en rojo".
8. Explica que todo queda en `proyecto/edicion.json`, un archivo que Claude edita por ellos.

## Problemas frecuentes en clase

| Síntoma | Causa y solución |
|---|---|
| `npm` no se reconoce | Node no está instalado o falta reiniciar Claude Code |
| Whisper no compila (Mac) | Falta `xcode-select --install` |
| Descarga lenta del modelo (~470 MB) | Muchos alumnos en la misma wifi: que cada uno lo haga en casa, o usa `--modelo base` (más rápido, menos preciso) |
| Claude pide permiso a cada paso | Normal la primera vez; el kit ya autoriza los comandos del editor en `.claude/settings.json` |
| Video de iPhone en HDR que se ve lavado | Exportarlo desde el móvil como "Más compatible" (H.264) |

## ¿Qué más meterle? (hoja de ruta)

Ordenado de mayor a menor impacto para tus alumnos:

1. **Kit de marca**: un archivo `marca.json` con colores, fuente, logo y CTA por alumno, que
   se aplique solo a cada video nuevo.
2. **Efectos de sonido** (pop, whoosh) sincronizados con los títulos y los zooms: hacen que
   el video "se sienta" editado.
3. **B-roll automático**: buscar imágenes o clips de stock gratuitos (API de Pexels, gratis
   con registro) según lo que se dice.
4. **Emojis y stickers animados** junto a palabras clave.
5. **Reencuadre inteligente**: detectar la cara y seguirla al pasar de horizontal a vertical.
6. **Música con ducking**: que baje sola cuando hablas.
7. **Varias versiones de una vez**: vertical, cuadrado y horizontal, o 3 ganchos distintos
   para testear anuncios.
8. **Subtítulos traducidos** (inglés/portugués) y archivo `.srt` para YouTube.
9. **Miniatura (thumbnail)** generada a partir de un frame del video.
10. **Skills técnicas oficiales de Remotion** (`npx skills add remotion-dev/skills`), que
    ayudan a Claude a crear efectos nuevos con mejores prácticas.

Cada punto es una skill nueva en `.claude/skills/` y, si hace falta, un componente en
`src/componentes/`. Pídeselo a Claude Code: "Crea una skill para…".

## Cómo actualizar el kit para los alumnos

1. Haz los cambios en este repositorio (tú o Claude) y súbelos a la rama `main`.
2. Los alumnos descargan el ZIP de nuevo, o, si usaron Git, ejecutan `git pull`.
3. Sus videos y ediciones no se pierden si copian su carpeta `proyecto/` y `public/` a la versión nueva.

## Notas legales

- Remotion es gratis para personas y empresas de hasta 3 empleados; las más grandes
  necesitan licencia (https://www.remotion.dev/license). Díselo a los alumnos que tengan agencia.
- Los alumnos solo deben usar música, imágenes y logos que tengan derecho a usar.
