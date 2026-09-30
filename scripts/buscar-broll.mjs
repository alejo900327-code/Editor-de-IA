// Uso: npm run broll -- "persona contando dinero" [--tipo foto|video] [--cantidad 3] [--nombre dinero]
// Busca imágenes o clips gratuitos en Pexels y los descarga a public/broll/.
// Necesita una clave gratuita de https://www.pexels.com/api/ en el archivo .env:
//   PEXELS_API_KEY=tu_clave
import fs from 'node:fs';
import path from 'node:path';
import {argumentos, fallar, PUBLIC, RAIZ} from './lib.mjs';

const leerClave = () => {
	if (process.env.PEXELS_API_KEY) {
		return process.env.PEXELS_API_KEY;
	}
	const env = path.join(RAIZ, '.env');
	if (fs.existsSync(env)) {
		const linea = fs
			.readFileSync(env, 'utf8')
			.split(/\r?\n/)
			.find((l) => l.trim().startsWith('PEXELS_API_KEY='));
		if (linea) {
			return linea.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
		}
	}
	return null;
};

const opciones = argumentos();
const consulta = opciones._.join(' ').trim();
const tipo = opciones.tipo ?? 'foto';
const cantidad = Math.min(Number(opciones.cantidad ?? 3), 10);
const nombre = (opciones.nombre ?? consulta)
	.normalize('NFD')
	.replace(/[̀-ͯ]/g, '')
	.replace(/[^a-zA-Z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '')
	.toLowerCase()
	.slice(0, 40);

if (!consulta) {
	fallar('Indica qué buscar. Ejemplo: npm run broll -- "persona contando dinero" --tipo video');
}
if (!['foto', 'video'].includes(tipo)) {
	fallar('El tipo debe ser foto o video.');
}
const clave = leerClave();
if (!clave) {
	fallar(
		'Falta la clave de Pexels. Crea una gratis en https://www.pexels.com/api/ y guárdala en el archivo .env así:\nPEXELS_API_KEY=tu_clave',
	);
}

// Pexels busca mejor en inglés, pero también entiende español con locale es-ES.
const url = new URL(tipo === 'video' ? 'https://api.pexels.com/videos/search' : 'https://api.pexels.com/v1/search');
url.searchParams.set('query', consulta);
url.searchParams.set('per_page', String(cantidad));
url.searchParams.set('orientation', opciones.orientacion ?? 'portrait');
url.searchParams.set('locale', 'es-ES');

const respuesta = await fetch(url, {headers: {Authorization: clave}});
if (respuesta.status === 401 || respuesta.status === 403) {
	fallar('Pexels rechazó la clave. Revisa PEXELS_API_KEY en el archivo .env.');
}
if (!respuesta.ok) {
	fallar(`Pexels respondió ${respuesta.status}. Prueba otra vez en un minuto.`);
}
const datos = await respuesta.json();

// Para video se elige el archivo MP4 más cercano a 1080 px de ancho.
const elegirArchivoVideo = (video) =>
	video.video_files
		.filter((f) => f.file_type === 'video/mp4' && f.width)
		.sort((a, b) => Math.abs(a.width - 1080) - Math.abs(b.width - 1080))[0];

const resultados =
	tipo === 'video'
		? (datos.videos ?? []).map((v) => ({
				link: elegirArchivoVideo(v)?.link,
				autor: v.user?.name,
				pagina: v.url,
				extension: '.mp4',
				duracion: v.duration,
			}))
		: (datos.photos ?? []).map((f) => ({
				link: f.src.portrait ?? f.src.large2x,
				autor: f.photographer,
				pagina: f.url,
				extension: '.jpg',
			}));

if (resultados.length === 0) {
	fallar(`No encontré resultados para "${consulta}". Prueba con otras palabras (en inglés suele funcionar mejor).`);
}

const carpeta = path.join(PUBLIC, 'broll');
fs.mkdirSync(carpeta, {recursive: true});
const creditos = path.join(carpeta, 'CREDITOS.txt');
for (const [i, r] of resultados.entries()) {
	if (!r.link) {
		continue;
	}
	const archivo = `${nombre}-${i + 1}${r.extension}`;
	const descarga = await fetch(r.link);
	if (!descarga.ok) {
		console.log(`No pude descargar ${archivo} (${descarga.status}), sigo con el siguiente.`);
		continue;
	}
	fs.writeFileSync(path.join(carpeta, archivo), Buffer.from(await descarga.arrayBuffer()));
	fs.appendFileSync(creditos, `${archivo}: ${r.autor ?? 'autor desconocido'} en Pexels - ${r.pagina}\n`);
	console.log(`Descargado public/broll/${archivo}${r.duracion ? ` (${r.duracion}s)` : ''} - por ${r.autor} en Pexels`);
}
console.log('\nLas imágenes y videos de Pexels son gratis y no exigen atribución (los créditos quedan en public/broll/CREDITOS.txt).');
