// Uso: npm run versiones [-- vertical cuadrado horizontal] [--encuadre desenfocado]
// Exporta la misma edición en varios formatos, uno detrás de otro.
// Por defecto exporta los tres formatos.
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {argumentos, fallar, RAIZ} from './lib.mjs';

const opciones = argumentos();
const formatos = opciones._.length > 0 ? opciones._ : ['vertical', 'cuadrado', 'horizontal'];
const extra = Object.entries(opciones)
	.filter(([clave]) => clave !== '_')
	.flatMap(([clave, valor]) => (valor === true ? [`--${clave}`] : [`--${clave}`, String(valor)]));

for (const formato of formatos) {
	console.log(`\n=== Versión ${formato} ===`);
	const r = spawnSync(process.execPath, [path.join(RAIZ, 'scripts', 'exportar.mjs'), '--formato', formato, ...extra], {
		cwd: RAIZ,
		stdio: 'inherit',
	});
	if (r.status !== 0) {
		fallar(`Falló la versión ${formato}.`);
	}
}
console.log(`\nListo: ${formatos.length} versiones en la carpeta entregas/.`);
