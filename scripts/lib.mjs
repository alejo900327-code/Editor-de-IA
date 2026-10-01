// Utilidades compartidas por los scripts del editor.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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

// Pausas reales del audio, en segundos del video original. Se mide el volumen medio
// cada 50 ms (no los picos): así los golpes cortos al tocar o mover el celular no
// cuentan como voz. ruido: volumen en dB por debajo del cual se considera silencio.
export const detectarSilencios = (archivo, {ruido = -40, minimo = 0.3, golpe = 0.15} = {}) => {
	const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), 'editor-ia-'));
	const wav = path.join(carpeta, 'audio.wav');
	let datos;
	try {
		remotion(['ffmpeg', '-y', '-i', archivo, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', wav], {
			silencioso: true,
		});
		datos = fs.readFileSync(wav);
	} finally {
		fs.rmSync(carpeta, {recursive: true, force: true});
	}

	// Busca el bloque "data" del WAV (16 bits, mono, 16000 Hz).
	let inicioDatos = 0;
	let largoDatos = 0;
	for (let o = 12; o + 8 <= datos.length; ) {
		const tamano = datos.readUInt32LE(o + 4);
		if (datos.toString('ascii', o, o + 4) === 'data') {
			inicioDatos = o + 8;
			largoDatos = Math.min(tamano, datos.length - inicioDatos);
			break;
		}
		o += 8 + tamano + (tamano % 2);
	}

	const VENTANA = 0.05;
	const muestras = 16000 * VENTANA;
	const callado = [];
	for (let i = inicioDatos; i + muestras * 2 <= inicioDatos + largoDatos; i += muestras * 2) {
		let suma = 0;
		for (let j = 0; j < muestras; j++) {
			const v = datos.readInt16LE(i + j * 2) / 32768;
			suma += v * v;
		}
		callado.push(10 * Math.log10(suma / muestras + 1e-12) < ruido);
	}

	// Tramos de silencio tal cual.
	const tramos = [];
	for (let i = 0; i < callado.length; ) {
		if (!callado[i]) {
			i++;
			continue;
		}
		let j = i;
		while (j < callado.length && callado[j]) {
			j++;
		}
		tramos.push({desde: i * VENTANA, hasta: j === callado.length ? Infinity : j * VENTANA});
		i = j;
	}

	// Un golpe corto (tocar o mover el celular) entre dos silencios largos no es voz: se
	// unen los dos silencios. Entre palabras los silencios son mucho más cortos.
	const unidos = [];
	for (const tramo of tramos) {
		const ultimo = unidos[unidos.length - 1];
		if (
			ultimo &&
			tramo.desde - ultimo.hasta <= golpe + 1e-9 &&
			ultimo.hasta - ultimo.desde >= 0.25 &&
			tramo.hasta - tramo.desde >= 0.25
		) {
			ultimo.hasta = tramo.hasta;
		} else {
			unidos.push({...tramo});
		}
	}
	const silencios = unidos.filter((t) => t.hasta - t.desde >= minimo);
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
