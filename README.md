# Editor de video con IA — Millonarios Conscientes

Edita tus videos hablando con una IA (**Claude Code** o **Codex**): **cortes**, **subtítulos animados**, **animaciones**,
**emojis**, **b-roll**, **efectos de sonido**, **tu marca** y **varios formatos**, sin saber
programar y sin pagar programas de edición.

Le dices a la IA qué quieres ("quita los silencios", "pon los subtítulos en amarillo",
"agrega un título cuando digo los 3 errores") y ella lo hace con código (Remotion) en tu computadora.

> **¿Claude Code o Codex?** Funciona con los dos. Esta guía usa Claude Code; si usas Codex,
> mira el recuadro del Paso 2 y escribe las skills con `$` en vez de `/`
> (por ejemplo, `$editar-video` en vez de `/editar-video`).

---

## Antes de empezar necesitas

- Una computadora **Mac o Windows** con al menos **3 GB libres**.
- Una cuenta de **Claude Pro o Max** (para Claude Code) **o** de **ChatGPT Plus o Pro** (para Codex).
- Un video hablado grabado con el móvil o la cámara (MP4 o MOV).
- Conexión a internet la primera vez (para instalar). Después funciona casi todo sin internet.

---

## Paso 1 — Instala Node.js (una sola vez)

1. Entra a **https://nodejs.org** y descarga la versión **LTS** (el botón verde).
2. Instálala con "Siguiente, Siguiente, Finalizar".

**Solo en Mac:** abre la app **Terminal**, pega esto y pulsa Enter; en la ventana que
aparece, pulsa **Instalar**:

```bash
xcode-select --install
```

(Si dice que ya está instalado, perfecto.)

**Solo en Windows:** instala **Git for Windows** desde https://git-scm.com/download/win
(todo con las opciones por defecto). Claude Code lo necesita.

## Paso 2 — Instala Claude Code o Codex (una sola vez)

**Opción fácil:** descarga la app de escritorio de Claude desde https://claude.ai/download,
inicia sesión y abre la pestaña **Code**.

**Opción terminal:**

- Mac: abre Terminal y pega `curl -fsSL https://claude.ai/install.sh | bash`
- Windows: abre PowerShell y pega `irm https://claude.ai/install.ps1 | iex`

Después escribe `claude` e inicia sesión con tu cuenta.

> **Si prefieres Codex:** instala la app de Codex o, en la terminal,
> `npm install -g @openai/codex`, y entra con tu cuenta de ChatGPT escribiendo `codex`.
> En los pasos siguientes abre la carpeta del editor en Codex en lugar de Claude Code y
> escribe las skills con `$` (`$instalar-editor`, `$editar-video`, …). Cuando Codex pida
> permiso para usar internet (instalar o descargar Whisper), apruébalo.

## Paso 3 — Descarga el editor

1. En esta página de GitHub pulsa el botón verde **Code** y luego **Download ZIP**.
2. Descomprime el ZIP en **Documentos**. Te queda una carpeta llamada `Editor-de-IA-main`.
   Puedes cambiarle el nombre, por ejemplo a `Mi-Editor`.

> ¿Sabes usar Git? También puedes hacer `git clone https://github.com/alejo900327-code/Editor-de-IA.git`

## Paso 4 — Abre la carpeta en Claude Code (o Codex)

- **App de escritorio:** en la pestaña Code, elige la carpeta del editor como proyecto.
- **Terminal:** entra a la carpeta y abre Claude:

  ```bash
  cd Documentos/Mi-Editor
  claude
  ```

## Paso 5 — Instala el editor (una sola vez)

Escribe en Claude:

```
/instalar-editor
```

Claude revisa tu computadora, instala lo necesario y hace una prueba. Tarda unos minutos.
Si te pide permiso para ejecutar un comando, lee qué hace y acepta.

> **Para practicar:** en `material-de-clase/guiones-de-practica.md` tienes 3 guiones cortos
> listos para grabar, y en `material-de-clase/plantillas-de-pedidos.md`, pedidos para copiar y pegar.

## Paso 6 — Crea tu kit de marca (recomendado, una sola vez)

Escribe:

```
/marca
```

Claude te pregunta tus colores, tu logo, tu llamado a la acción y tu estilo. A partir de ahí
**todos tus videos salen con tu marca** sin repetirlo. Antes, copia tu logo (PNG) a la
carpeta `public/imagenes/`.

## Paso 7 — Edita tu primer video

Escribe:

```
/editar-video
```

Claude te hará unas preguntas rápidas (dónde está el video, para qué red social, colores…).
Puedes **arrastrar el archivo del video al chat** para darle la ruta.

Luego, él solo:

1. **Transcribe** lo que dices (con Whisper, gratis, en tu computadora; la primera vez
   descarga el programa y tarda unos minutos).
2. **Corta** los silencios, las muletillas y las tomas repetidas.
3. **Pone los subtítulos** con la palabra que dices resaltada, estilo TikTok.
4. **Te propone animaciones** (títulos, zoom, imágenes) según lo que dices.
5. **Exporta una muestra de 8 segundos** para que la revises en el móvil.
6. Cuando la apruebas, **exporta el video completo** a la carpeta `entregas/`.

## Paso 8 — Mira la vista previa (opcional)

Pídele a Claude *"abre la vista previa"* o escribe en la terminal `npm run estudio`.
Se abre **http://localhost:3000** en el navegador con tu video y se actualiza solo cada vez
que Claude hace un cambio.

---

## Qué le puedes pedir (ejemplos)

**Cortes**
- "Quita los silencios, pero deja un ritmo natural"
- "Hazlo más rápido, estilo TikTok"
- "Quita la parte donde me equivoqué al principio"
- "Corta desde 'bueno, entonces' hasta 'lo importante es'"

**Subtítulos**
- "Pon los subtítulos más grandes y un poco más arriba"
- "La palabra resaltada en verde #00E676"
- "Corrige: dice 'Millonarios Concientes', es 'Conscientes'"
- "Muestra menos palabras a la vez"

**Animaciones**
- "Pon un título al inicio con la pregunta del gancho"
- "Haz zoom cuando digo 'esto es lo más importante'"
- "Muestra mi logo (`public/imagenes/logo.png`) cuando digo el nombre de la marca"
- "Agrega la música `public/musica/fondo.mp3` bajita"
- "Agrega una barra de progreso arriba"

**Emojis, b-roll y sonidos**
- "Pon emojis en las palabras clave, sin pasarte"
- "Pon un 💰 cuando hablo de ganancias"
- "Pon b-roll cuando hablo de mi primer cliente"
- "Añade efectos de sonido a los títulos, bajitos"
- "Quita el sonido del zoom"

**Exportar y versiones**
- "Exporta una muestra desde el segundo 15"
- "Exporta el video final"
- "Hazme también la versión cuadrada y la horizontal para YouTube"

### Todas las skills

| Skill | Para qué |
|---|---|
| `/instalar-editor` | Instalar y comprobar todo (la primera vez) |
| `/marca` | Tus colores, logo, música y llamado a la acción, para todos los videos |
| `/editar-video` | **Todo el proceso de principio a fin** |
| `/cortar-video` | Silencios, muletillas, tomas repetidas o partes concretas |
| `/subtitular-video` | Subtítulos: corregir palabras, color, tamaño, posición |
| `/animar-video` | Títulos, imágenes, zoom, música, barra de progreso |
| `/emojis` | Emojis animados junto a las palabras clave |
| `/broll` | Imágenes y clips de apoyo (propios o gratis de Pexels) |
| `/efectos-sonido` | Pop, whoosh, ding e impacto sincronizados |
| `/exportar-video` | Muestra de 8 segundos y video final |
| `/versiones` | El mismo video en vertical, cuadrado y horizontal |

### B-roll gratis con Pexels (opcional)

Para que Claude descargue imágenes y clips gratis, crea una clave en
https://www.pexels.com/api/ (registro gratuito). Luego crea en la carpeta del editor un
archivo llamado `.env` con esta línea (mira el ejemplo en `.env.ejemplo`):

```
PEXELS_API_KEY=tu_clave
```

No compartas esa clave ni la pegues en el chat.

---

## Dónde está cada cosa

```
Mi-Editor/
├── public/videos/      ← tus videos (Claude los copia aquí)
├── public/imagenes/    ← pon aquí tu logo e imágenes
├── public/musica/      ← pon aquí tu música
├── public/broll/       ← imágenes y clips de apoyo
├── public/sonidos/     ← efectos de sonido (pop, whoosh, ding, impacto)
├── entregas/           ← AQUÍ salen tus videos terminados
├── proyecto/
│   ├── marca.json           ← tu kit de marca
│   ├── edicion.json         ← la edición (cortes, estilo, animaciones)
│   ├── transcripcion.txt    ← lo que dices, con tiempos
│   └── versiones/           ← copias de seguridad de cada etapa
├── material-de-clase/  ← guiones de práctica, plantillas de pedidos y hojas de seguimiento
├── .claude/skills/     ← las skills (Claude Code)
├── .agents/skills/     ← las mismas skills (Codex)
└── src/                ← el código del editor (no hace falta tocarlo)
```

## Si algo falla

| Problema | Solución |
|---|---|
| `npm` o `node` "no se reconoce" | Instala Node.js (Paso 1) y **cierra y vuelve a abrir** Claude Code o Codex |
| La skill no aparece | Comprueba que abriste la carpeta del editor (no una carpeta de dentro) y reinicia el agente |
| La transcripción falla en Mac | Ejecuta `xcode-select --install` (Paso 1) y pide `/instalar-editor` de nuevo |
| Windows bloquea `main.exe` | Es Whisper: permítelo en el antivirus |
| Transcribe mal nombres o marcas | Dile a Claude la palabra correcta, o pide "transcribe con el modelo medium" |
| El subtítulo tapa la cara | "Sube/baja los subtítulos" o "pon el video en modo ajustar" |
| No encuentras el video exportado | Está en la carpeta `entregas/`, con la fecha en el nombre |
| Otra cosa | Cuéntaselo a Claude tal cual, con el mensaje de error |

## Créditos y licencias

- Hecho con [Remotion](https://www.remotion.dev). Es gratis para personas y empresas de
  hasta 3 empleados; las empresas más grandes necesitan licencia: https://www.remotion.dev/license
- Transcripción con [Whisper](https://github.com/ggerganov/whisper.cpp) (licencia MIT).
- Fuente Montserrat (SIL Open Font License, incluida en `public/fuentes`).
- Efectos de sonido creados para este kit (uso libre).
- B-roll opcional de [Pexels](https://www.pexels.com) (licencia gratuita de Pexels).
