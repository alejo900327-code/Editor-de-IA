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
| 70-85 | Nivel pro | `/marca`, `/emojis`, `/efectos-sonido`, `/broll` y `/versiones` |
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

## Ya incluido en el kit

- Kit de marca (`/marca`): colores, logo como marca de agua, música, CTA y estilo, aplicados
  solos a cada video nuevo.
- Efectos de sonido (`/efectos-sonido`): pop, whoosh, ding e impacto, automáticos con cada
  animación o en frases concretas.
- B-roll (`/broll`): material propio o descargado gratis de Pexels, a pantalla completa o en ventana.
- Emojis animados (`/emojis`) junto a las palabras clave.
- Varias versiones (`/versiones`): vertical, cuadrado y horizontal, con fondo desenfocado.

**Pruébalo hoy también:** el b-roll de Pexels necesita tu propia clave gratuita en `.env`
(no se pudo probar en el entorno donde se construyó el kit).

## ¿Qué más meterle? (siguientes ideas)

1. **Reencuadre inteligente**: detectar la cara y seguirla al pasar de horizontal a vertical.
2. **Música con ducking**: que baje sola cuando hablas.
3. **Quitar muletillas automático**: una lista de muletillas por alumno que se corte sola.
4. **Varios ganchos**: 3 inicios distintos del mismo video para testear anuncios.
5. **Subtítulos traducidos** (inglés/portugués) y archivo `.srt` para YouTube.
6. **Miniatura (thumbnail)** generada a partir de un frame del video.
7. **Skills técnicas oficiales de Remotion** (`npx skills add remotion-dev/skills`), que
   ayudan a Claude a crear efectos nuevos con mejores prácticas.

Cada idea es una skill nueva en `.claude/skills/` y, si hace falta, un componente en
`src/componentes/`. Pídeselo a Claude Code: "Crea una skill para…".

## Cómo actualizar el kit para los alumnos

1. Haz los cambios en este repositorio (tú o Claude) y súbelos a la rama `main`.
2. Los alumnos descargan el ZIP de nuevo, o, si usaron Git, ejecutan `git pull`.
3. Sus videos y ediciones no se pierden si copian su carpeta `proyecto/` y `public/` a la versión nueva.

## Notas legales

- Remotion es gratis para personas y empresas de hasta 3 empleados; las más grandes
  necesitan licencia (https://www.remotion.dev/license). Díselo a los alumnos que tengan agencia.
- Los alumnos solo deben usar música, imágenes y logos que tengan derecho a usar.
