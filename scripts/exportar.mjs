// Uso:
//   npm run exportar                      -> video completo en entregas/
//   npm run exportar -- --muestra         -> solo 8 segundos desde el inicio
//   npm run exportar -- --muestra 20      -> 8 segundos desde el segundo 20 del video FINAL
// Cualquier otra opción se pasa tal cual a "remotion render".
import path from 'node:path';
import {argumentos, leerEdicion, RAIZ, remotion} from './lib.mjs';

const opciones = argumentos();
const {muestra, ...resto} = opciones;
const edicion = leerEdicion();
const nombreBase = path.basename(edicion.video ?? 'video', path.extname(edicion.video ?? ''));
const hora = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

const args = ['render', 'src/index.ts', 'EditorIA'];
let salida;
if (muestra !== undefined) {
	const {fps} = edicion.formato;
	// Misma duración que calcula src/Root.tsx (mínimo 3 segundos).
	const segundosFinales =
		edicion.cortes.reduce((suma, t) => suma + t.hasta - t.desde, 0) || edicion.duracionOriginal;
	const total = Math.max(Math.round(segundosFinales * fps), fps * 3);
	const inicio = Math.min(Math.round(Number(muestra === true ? 0 : muestra) * fps), total - 1);
	args.push(`--frames=${inicio}-${Math.min(inicio + 8 * fps, total) - 1}`);
	salida = `entregas/${nombreBase}-muestra-${hora}.mp4`;
} else {
	salida = `entregas/${nombreBase}-final-${hora}.mp4`;
}
args.push(salida, '--codec=h264', '--audio-codec=aac');
for (const [clave, valor] of Object.entries(resto)) {
	if (clave !== '_') {
		args.push(valor === true ? `--${clave}` : `--${clave}=${valor}`);
	}
}

remotion(args);
console.log(`\nVideo exportado: ${path.join(RAIZ, salida)}`);
