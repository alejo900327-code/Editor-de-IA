// Uso: npm run verificar
// Revisa proyecto/edicion.json y muestra un resumen de la edición.
// Claude lo ejecuta después de cada cambio para detectar errores.
import fs from 'node:fs';
import path from 'node:path';
import {leerEdicion, leerJson, PUBLIC, RUTA_TRANSCRIPCION, segundos} from './lib.mjs';

const errores = [];
const avisos = [];
let e;
try {
	e = leerEdicion();
} catch (error) {
	console.error(`ERROR: proyecto/edicion.json no es un JSON válido.\n${error.message}`);
	process.exit(1);
}

if (!e.video) {
	avisos.push('Aún no hay video. Usa: npm run preparar -- "ruta/al/video.mp4"');
} else if (!fs.existsSync(path.join(PUBLIC, 'videos', e.video))) {
	errores.push(`Falta el archivo public/videos/${e.video}`);
}

const cortes = e.cortes ?? [];
cortes.forEach((t, i) => {
	if (!(t.hasta > t.desde)) {
		errores.push(`Corte ${i + 1}: "hasta" (${t.hasta}) debe ser mayor que "desde" (${t.desde}).`);
	}
	if (t.desde < 0 || t.hasta > e.duracionOriginal + 0.05) {
		errores.push(`Corte ${i + 1} se sale del video (0 a ${e.duracionOriginal}s).`);
	}
	if (i > 0 && t.desde < cortes[i - 1].hasta) {
		errores.push(`Corte ${i + 1} se superpone con el anterior o está desordenado.`);
	}
});

const dentro = (t) => cortes.some((c) => t >= c.desde && t < c.hasta);
const TIPOS = ['titulo', 'imagen', 'zoom'];
(e.animaciones ?? []).forEach((a, i) => {
	const nombre = `Animación ${i + 1} (${a.tipo})`;
	if (!TIPOS.includes(a.tipo)) {
		errores.push(`${nombre}: tipo desconocido. Usa: ${TIPOS.join(', ')}.`);
	}
	if (typeof a.en !== 'number' || typeof a.duracion !== 'number' || a.duracion <= 0) {
		errores.push(`${nombre}: necesita "en" y "duracion" en segundos.`);
	} else if (cortes.length > 0 && !dentro(a.en)) {
		avisos.push(`${nombre}: el segundo ${a.en} fue cortado; aparecerá al inicio del siguiente tramo.`);
	}
	if (a.tipo === 'titulo' && !a.texto) {
		errores.push(`${nombre}: falta "texto".`);
	}
	if (a.tipo === 'imagen' && !fs.existsSync(path.join(PUBLIC, 'imagenes', a.archivo ?? ''))) {
		errores.push(`${nombre}: no existe public/imagenes/${a.archivo}`);
	}
});

if (e.musica?.archivo && !fs.existsSync(path.join(PUBLIC, 'musica', e.musica.archivo))) {
	errores.push(`No existe public/musica/${e.musica.archivo}`);
}

const palabras = leerJson(RUTA_TRANSCRIPCION);
if (e.subtitulos?.activos && palabras.length === 0) {
	avisos.push('Los subtítulos están activos pero no hay transcripción (npm run transcribir).');
}

const final = cortes.reduce((s, t) => s + t.hasta - t.desde, 0) || e.duracionOriginal;
console.log('RESUMEN DE LA EDICIÓN');
console.log(`  Video: ${e.video ?? '(ninguno)'} | ${e.formato.ancho}x${e.formato.alto} a ${e.formato.fps} fps`);
console.log(`  Duración: ${segundos(e.duracionOriginal ?? 0)} original -> ${segundos(final)} final (${cortes.length} tramos)`);
console.log(`  Subtítulos: ${e.subtitulos?.activos ? `sí (${palabras.length} palabras)` : 'no'}`);
console.log(`  Animaciones: ${(e.animaciones ?? []).length} | Música: ${e.musica?.archivo ?? 'no'}`);
for (const a of avisos) {
	console.log(`AVISO: ${a}`);
}
for (const x of errores) {
	console.log(`ERROR: ${x}`);
}
if (errores.length > 0) {
	process.exit(1);
}
console.log('Todo en orden.');
