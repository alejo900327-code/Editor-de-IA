// Utilidades compartidas por los scripts del editor.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PROYECTO = path.join(RAIZ, 'proyecto');
export const PUBLIC = path.join(RAIZ, 'public');
export const RUTA_EDICION = path.join(PROYECTO, 'edicion.json');
export const RUTA_TRANSCRIPCION = path.join(PROYECTO, 'transcripcion.json');
export const RUTA_TEXTO = path.join(PROYECTO, 'transcripcion.txt');

export const leerJson = (ruta) => JSON.parse(fs.readFileSync(ruta, 'utf8'));
export const guardarJson = (ruta, datos) => fs.writeFileSync(ruta, `${JSON.stringify(datos, null, 2)}\n`);

export const leerEdicion = () => leerJson(RUTA_EDICION);
export const guardarEdicion = (edicion) => guardarJson(RUTA_EDICION, edicion);

// Lee "--nombre valor" y "--bandera" de la línea de comandos.
export const argumentos = () => {
	const lista = process.argv.slice(2);
	const opciones = {_: []};
	for (let i = 0; i < lista.length; i++) {
		const actual = lista[i];
		if (!actual.startsWith('--')) {
			opciones._.push(actual);
			continue;
		}
		const siguiente = lista[i + 1];
		if (siguiente === undefined || siguiente.startsWith('--')) {
			opciones[actual.slice(2)] = true;
		} else {
			opciones[actual.slice(2)] = siguiente;
			i++;
		}
	}
	return opciones;
};

// Ejecuta el CLI de Remotion instalado en el proyecto (incluye ffmpeg propio).
// Se llama con node directamente, sin shell, para que las rutas con espacios
// (por ejemplo C:\Users\Juan Pérez) funcionen también en Windows.
export const remotion = (args, {silencioso = false} = {}) => {
	const cli = path.join(RAIZ, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
	const r = spawnSync(process.execPath, [cli, ...args], {
		cwd: RAIZ,
		stdio: silencioso ? 'pipe' : 'inherit',
		maxBuffer: 64 * 1024 * 1024,
	});
	if (r.status !== 0) {
		if (silencioso) {
			process.stderr.write(r.stderr?.toString() ?? '');
		}
		throw new Error(`Falló: remotion ${args.join(' ')}`);
	}
	return r;
};

// Pausas reales del audio (ffmpeg silencedetect), en segundos del video original.
// ruido: volumen en dB por debajo del cual se considera silencio.
export const detectarSilencios = (archivo, {ruido = -35, minimo = 0.3} = {}) => {
	const r = remotion(
		['ffmpeg', '-hide_banner', '-nostats', '-i', archivo, '-vn', '-af', `silencedetect=noise=${ruido}dB:d=${minimo}`, '-f', 'null', '-'],
		{silencioso: true},
	);
	const silencios = [];
	let inicio = null;
	for (const linea of r.stderr.toString().split('\n')) {
		const empieza = linea.match(/silence_start: (-?[\d.]+)/);
		const termina = linea.match(/silence_end: ([\d.]+)/);
		if (empieza) {
			inicio = Math.max(0, Number(empieza[1]));
		}
		if (termina && inicio !== null) {
			silencios.push({desde: inicio, hasta: Number(termina[1])});
			inicio = null;
		}
	}
	if (inicio !== null) {
		silencios.push({desde: inicio, hasta: Infinity});
	}
	return silencios;
};

// Whisper alarga la última palabra antes de una pausa hasta la frase siguiente. Si una
// pausa real empieza en medio de una palabra, la palabra termina ahí: así el subtítulo
// no se queda en pantalla durante el silencio.
export const ajustarPalabras = (palabras, silencios) =>
	palabras.map((p) => {
		const inicio = p.startMs / 1000;
		const pausa = silencios.find((s) => s.desde > inicio + 0.05 && s.desde < p.endMs / 1000);
		if (!pausa) {
			return p;
		}
		const endMs = Math.round(pausa.desde * 1000);
		const timestampMs = p.timestampMs == null ? p.timestampMs : Math.min(p.timestampMs, endMs);
		return {...p, endMs, timestampMs};
	});

// Fecha y hora LOCAL para nombres de archivo, por ejemplo 2026-09-30-18-53.
export const marcaDeTiempo = () => {
	const d = new Date();
	const dos = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}-${dos(d.getHours())}-${dos(d.getMinutes())}`;
};

export const fallar = (mensaje) => {
	console.error(`\nERROR: ${mensaje}`);
	process.exit(1);
};

export const segundos = (s) => `${s.toFixed(2)}s`;
