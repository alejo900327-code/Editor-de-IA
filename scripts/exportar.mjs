// Uso:
//   npm run exportar                              -> video completo en entregas/
//   npm run exportar -- --muestra                 -> solo 8 segundos desde el inicio
//   npm run exportar -- --muestra 20              -> 8 segundos desde el segundo 20 del video FINAL
//   npm run exportar -- --formato cuadrado        -> otra versión (vertical, horizontal o cuadrado)
//   npm run exportar -- --encuadre desenfocado    -> llenar, ajustar o desenfocado (fondo borroso)
// Cualquier otra opción se pasa tal cual a "remotion render".
import fs from 'node:fs';
import path from 'node:path';
import {argumentos, fallar, leerEdicion, marcaDeTiempo, RAIZ, remotion} from './lib.mjs';

const FORMATOS = ['vertical', 'horizontal', 'cuadrado'];
const ENCUADRES = ['llenar', 'ajustar', 'desenfocado'];

const opciones = argumentos();
const {muestra, formato, encuadre, ...resto} = opciones;
if (formato !== undefined && !FORMATOS.includes(formato)) {
	fallar(`El formato debe ser: ${FORMATOS.join(', ')}.`);
}
if (encuadre !== undefined && !ENCUADRES.includes(encuadre)) {
	fallar(`El encuadre debe ser: ${ENCUADRES.join(', ')}.`);
}
const edicion = leerEdicion();
const nombreBase = path.basename(edicion.video ?? 'video', path.extname(edicion.video ?? ''));
const hora = marcaDeTiempo();
const sufijo = formato ? `-${formato}` : '';

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
	salida = `entregas/${nombreBase}${sufijo}-muestra-${hora}.mp4`;
} else {
	salida = `entregas/${nombreBase}${sufijo}-final-${hora}.mp4`;
}
args.push(salida, '--codec=h264', '--audio-codec=aac');

// Las props van en un archivo para evitar problemas de comillas en Windows.
if (formato || encuadre) {
	const carpeta = path.join(RAIZ, 'out');
	fs.mkdirSync(carpeta, {recursive: true});
	const archivoProps = path.join(carpeta, 'props-version.json');
	fs.writeFileSync(archivoProps, JSON.stringify({formato, encuadre}));
	args.push(`--props=${archivoProps}`);
}
for (const [clave, valor] of Object.entries(resto)) {
	if (clave !== '_') {
		args.push(valor === true ? `--${clave}` : `--${clave}=${valor}`);
	}
}

remotion(args);
console.log(`\nVideo exportado: ${path.join(RAIZ, salida)}`);
