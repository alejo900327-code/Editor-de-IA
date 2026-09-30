// Uso: npm run preparar -- "ruta/a/mi-video.mp4" [--formato vertical|horizontal|cuadrado]
// Copia el video a public/videos, lee su duración y deja un proyecto limpio.
// El proyecto anterior se guarda en proyecto/historial/.
import fs from 'node:fs';
import path from 'node:path';
import {parseMedia} from '@remotion/media-parser';
import {nodeReader} from '@remotion/media-parser/node';
import {
	argumentos,
	fallar,
	guardarEdicion,
	guardarJson,
	leerEdicion,
	PROYECTO,
	PUBLIC,
	RUTA_TEXTO,
	RUTA_TRANSCRIPCION,
	segundos,
} from './lib.mjs';

const FORMATOS = {
	vertical: {ancho: 1080, alto: 1920},
	horizontal: {ancho: 1920, alto: 1080},
	cuadrado: {ancho: 1080, alto: 1080},
};

const opciones = argumentos();
const origen = opciones._[0];
if (!origen) {
	fallar('Indica el video. Ejemplo: npm run preparar -- "C:/Users/yo/Desktop/mi-video.mp4"');
}
if (!fs.existsSync(origen)) {
	fallar(`No encuentro el archivo: ${origen}`);
}
const formato = opciones.formato ?? 'vertical';
if (!FORMATOS[formato]) {
	fallar('El formato debe ser vertical, horizontal o cuadrado.');
}

const anterior = leerEdicion();
if (anterior.video) {
	const carpeta = path.join(PROYECTO, 'historial', new Date().toISOString().replace(/[:.]/g, '-'));
	fs.mkdirSync(carpeta, {recursive: true});
	for (const archivo of ['edicion.json', 'transcripcion.json', 'transcripcion.txt']) {
		fs.copyFileSync(path.join(PROYECTO, archivo), path.join(carpeta, archivo));
	}
	console.log(`Proyecto anterior guardado en ${path.relative(process.cwd(), carpeta)}`);
}

// Nombre sin espacios ni tildes para evitar problemas en cualquier sistema.
const extension = path.extname(origen).toLowerCase() || '.mp4';
const nombre = `${path
	.basename(origen, path.extname(origen))
	.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '')
	.replace(/[^a-zA-Z0-9-_]+/g, '-')
	.replace(/^-+|-+$/g, '')
	.toLowerCase() || 'video'}${extension}`;
const destino = path.join(PUBLIC, 'videos', nombre);
if (path.resolve(origen) !== path.resolve(destino)) {
	fs.copyFileSync(origen, destino);
}

const info = await parseMedia({
	src: destino,
	reader: nodeReader,
	fields: {durationInSeconds: true, dimensions: true, fps: true},
	acknowledgeRemotionLicense: true,
});
if (!info.durationInSeconds) {
	fallar('No pude leer la duración del video. Prueba exportarlo de nuevo como MP4 (H.264).');
}

const duracion = Math.floor(info.durationInSeconds * 100) / 100;
guardarEdicion({
	...anterior,
	video: nombre,
	duracionOriginal: duracion,
	formato: {...FORMATOS[formato], fps: 30},
	cortes: [{desde: 0, hasta: duracion}],
	animaciones: [],
});
guardarJson(RUTA_TRANSCRIPCION, []);
fs.writeFileSync(RUTA_TEXTO, 'Aun no hay transcripcion. Ejecuta: npm run transcribir\n');

console.log(`\nVideo listo: public/videos/${nombre}`);
console.log(`Duración: ${segundos(duracion)} | Original: ${info.dimensions?.width}x${info.dimensions?.height} a ${info.fps?.toFixed(2) ?? '?'} fps`);
console.log(`Formato de salida: ${formato} ${FORMATOS[formato].ancho}x${FORMATOS[formato].alto} a 30 fps`);
console.log('Siguiente paso: npm run transcribir');
