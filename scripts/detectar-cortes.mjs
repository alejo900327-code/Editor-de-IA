// Uso: npm run cortes [-- --silencio 0.6] [--margen 0.15]
// Quita los silencios usando los tiempos de la transcripción: se conserva la
// voz y se corta toda pausa más larga que --silencio segundos.
import {argumentos, fallar, guardarEdicion, leerEdicion, leerJson, RUTA_TRANSCRIPCION, segundos} from './lib.mjs';

const opciones = argumentos();
const silencio = Number(opciones.silencio ?? 0.6);
const margen = Number(opciones.margen ?? 0.15);

const edicion = leerEdicion();
const palabras = leerJson(RUTA_TRANSCRIPCION);
if (palabras.length === 0) {
	fallar('No hay transcripción. Ejecuta primero: npm run transcribir');
}

const tramos = [];
for (const p of palabras) {
	const desde = Math.max(0, p.startMs / 1000 - margen);
	const hasta = Math.min(edicion.duracionOriginal, p.endMs / 1000 + margen);
	const ultimo = tramos[tramos.length - 1];
	if (ultimo && desde - ultimo.hasta < silencio) {
		ultimo.hasta = Math.max(ultimo.hasta, hasta);
	} else {
		tramos.push({desde, hasta});
	}
}
const redondear = (t) => Math.round(t * 100) / 100;
edicion.cortes = tramos.map((t) => ({desde: redondear(t.desde), hasta: redondear(t.hasta)}));
guardarEdicion(edicion);

const final = edicion.cortes.reduce((suma, t) => suma + t.hasta - t.desde, 0);
console.log(`Tramos conservados: ${edicion.cortes.length}`);
console.log(`Duración: ${segundos(edicion.duracionOriginal)} -> ${segundos(final)} (se quitaron ${segundos(edicion.duracionOriginal - final)} de silencios)`);
