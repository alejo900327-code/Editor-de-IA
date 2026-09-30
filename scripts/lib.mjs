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
export const remotion = (args, {silencioso = false} = {}) => {
	const bin = path.join(RAIZ, 'node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');
	const r = spawnSync(bin, args, {
		cwd: RAIZ,
		stdio: silencioso ? 'pipe' : 'inherit',
		shell: process.platform === 'win32',
	});
	if (r.status !== 0) {
		if (silencioso) {
			process.stderr.write(r.stderr?.toString() ?? '');
		}
		throw new Error(`Falló: remotion ${args.join(' ')}`);
	}
	return r;
};

export const fallar = (mensaje) => {
	console.error(`\nERROR: ${mensaje}`);
	process.exit(1);
};

export const segundos = (s) => `${s.toFixed(2)}s`;
