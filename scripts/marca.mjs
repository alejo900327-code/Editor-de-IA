// Uso: npm run marca
// Aplica el kit de marca (proyecto/marca.json) a la edición actual: colores de
// subtítulos y títulos, logo, música, sonidos y barra de progreso.
// "npm run preparar" también lo aplica solo a cada video nuevo.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fallar, guardarEdicion, leerEdicion, leerJson, PROYECTO} from './lib.mjs';

export const RUTA_MARCA = path.join(PROYECTO, 'marca.json');

export const leerMarca = () => (fs.existsSync(RUTA_MARCA) ? leerJson(RUTA_MARCA) : null);

// Devuelve una copia de la edición con la marca aplicada. No toca cortes ni animaciones.
export const aplicarMarca = (edicion, marca) => ({
	...edicion,
	subtitulos: {
		...edicion.subtitulos,
		...marca.subtitulos,
		color: marca.colorSubtitulos,
		colorResaltado: marca.colorPrincipal,
		borde: marca.colorBorde,
	},
	estiloTitulos: {fondo: marca.colorPrincipal, color: marca.colorTextoSobrePrincipal},
	marcaDeAgua: {
		...(edicion.marcaDeAgua ?? {ancho: 18, opacidad: 0.9}),
		archivo: marca.logoComoMarcaDeAgua ? marca.logo : null,
		esquina: marca.esquinaLogo ?? 'arriba-derecha',
	},
	musica: {archivo: marca.musica, volumen: marca.volumenMusica ?? 0.08},
	sonidos: {...edicion.sonidos, activos: marca.sonidos !== false},
	barraProgreso: Boolean(marca.barraProgreso),
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const marca = leerMarca();
	if (!marca?.configurada) {
		fallar('Aún no hay marca configurada. Pídele a Claude: /marca');
	}
	guardarEdicion(aplicarMarca(leerEdicion(), marca));
	console.log(`Marca "${marca.nombre || 'sin nombre'}" aplicada a la edición actual.`);
}
