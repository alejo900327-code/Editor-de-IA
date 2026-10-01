// Uso: npm run cortes [-- --silencio 0.6] [--margen 0.15] [--ruido -35]
// Quita los silencios midiendo el volumen real del audio: se conserva la voz y se
// corta toda pausa más larga que --silencio segundos. --ruido es el volumen (dB) por
// debajo del cual se considera silencio; con mucho ruido de fondo prueba -30.
// Ninguna palabra de la transcripción se queda fuera, aunque Whisper la marque tarde.
import path from 'node:path';
import {
	argumentos,
	detectarSilencios,
	fallar,
	guardarEdicion,
	leerEdicion,
	leerJson,
	PUBLIC,
	RUTA_TRANSCRIPCION,
	segundos,
} from './lib.mjs';

const opciones = argumentos();
const silencio = Number(opciones.silencio ?? 0.6);
const margen = Number(opciones.margen ?? 0.15);
const ruido = Number(opciones.ruido ?? -35);

const edicion = leerEdicion();
if (!edicion.video) {
	fallar('Primero prepara un video: npm run preparar -- "ruta/al/video.mp4"');
}
const palabras = leerJson(RUTA_TRANSCRIPCION);
if (palabras.length === 0) {
	fallar('No hay transcripción. Ejecuta primero: npm run transcribir');
}
const duracion = edicion.duracionOriginal;

// Tramos de voz: todo lo que no es una pausa larga, con un pequeño margen a cada lado.
const pausas = detectarSilencios(path.join(PUBLIC, 'videos', edicion.video), {ruido, minimo: silencio});
let tramos = [];
let desde = 0;
for (const pausa of pausas) {
	if (pausa.desde > desde) {
		tramos.push({desde, hasta: pausa.desde});
	}
	desde = pausa.hasta;
}
if (desde < duracion) {
	tramos.push({desde, hasta: duracion});
}
tramos = tramos.map((t) => ({desde: Math.max(0, t.desde - margen), hasta: Math.min(duracion, t.hasta + margen)}));

// Si Whisper marca una palabra dentro de una pausa, se alarga el tramo más cercano
// para no perder su subtítulo.
for (const p of palabras) {
	const t = p.startMs / 1000;
	if (tramos.some((tramo) => t >= tramo.desde && t < tramo.hasta)) {
		continue;
	}
	const cercano = tramos.reduce(
		(mejor, tramo) => {
			const distancia = t < tramo.desde ? tramo.desde - t : t - tramo.hasta;
			return distancia < mejor.distancia ? {tramo, distancia} : mejor;
		},
		{tramo: null, distancia: Infinity},
	).tramo;
	if (cercano) {
		cercano.desde = Math.min(cercano.desde, t);
		cercano.hasta = Math.max(cercano.hasta, Math.min(duracion, t + 0.1));
	} else {
		tramos.push({desde: t, hasta: Math.min(duracion, t + 0.1)});
	}
}

// Ordena y une los tramos que se tocan.
tramos.sort((a, b) => a.desde - b.desde);
const unidos = [];
for (const tramo of tramos) {
	const ultimo = unidos[unidos.length - 1];
	if (ultimo && tramo.desde <= ultimo.hasta) {
		ultimo.hasta = Math.max(ultimo.hasta, tramo.hasta);
	} else {
		unidos.push({...tramo});
	}
}

const redondear = (t) => Math.round(t * 100) / 100;
edicion.cortes = unidos.map((t) => ({desde: redondear(t.desde), hasta: redondear(t.hasta)}));
guardarEdicion(edicion);

const final = edicion.cortes.reduce((suma, t) => suma + t.hasta - t.desde, 0);
console.log(`Tramos conservados: ${edicion.cortes.length}`);
console.log(`Duración: ${segundos(duracion)} -> ${segundos(final)} (se quitaron ${segundos(duracion - final)} de silencios)`);
