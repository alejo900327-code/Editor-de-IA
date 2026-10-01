// Uso: npm run transcribir [-- --modelo small|medium|large-v3-turbo] [--idioma es]
// Transcribe el video en tu computadora con Whisper (gratis, sin internet
// después de la primera descarga). Guarda cada palabra con su tiempo en
// proyecto/transcripcion.json y una versión legible en proyecto/transcripcion.txt.
import fs from 'node:fs';
import path from 'node:path';
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe} from '@remotion/install-whisper-cpp';
import {
	ajustarPalabras,
	argumentos,
	detectarSilencios,
	fallar,
	guardarJson,
	leerEdicion,
	PUBLIC,
	RAIZ,
	remotion,
	RUTA_TEXTO,
	RUTA_TRANSCRIPCION,
} from './lib.mjs';

const VERSION_WHISPER = '1.5.5';
const CARPETA_WHISPER = path.join(RAIZ, '.whisper');

const opciones = argumentos();
const modelo = opciones.modelo ?? 'small';
const idioma = opciones.idioma ?? 'es';

const edicion = leerEdicion();
if (!edicion.video) {
	fallar('Primero prepara un video: npm run preparar -- "ruta/al/video.mp4"');
}

console.log('1/4 Instalando Whisper (solo la primera vez, puede tardar unos minutos)...');
await installWhisperCpp({to: CARPETA_WHISPER, version: VERSION_WHISPER});

console.log(`2/4 Descargando el modelo "${modelo}" (solo la primera vez)...`);
await downloadWhisperModel({model: modelo, folder: CARPETA_WHISPER});

console.log('3/4 Extrayendo el audio...');
const audio = path.join(CARPETA_WHISPER, 'audio.wav');
remotion(['ffmpeg', '-y', '-i', path.join(PUBLIC, 'videos', edicion.video), '-ar', '16000', '-ac', '1', audio], {
	silencioso: true,
});

let ultimoPorcentaje = -1;
console.log('4/4 Transcribiendo (en un portátil normal tarda aprox. lo mismo que dura el video)...');
const resultado = await transcribe({
	inputPath: audio,
	whisperPath: CARPETA_WHISPER,
	whisperCppVersion: VERSION_WHISPER,
	model: modelo,
	language: idioma,
	tokenLevelTimestamps: true,
	splitOnWord: true,
	printOutput: false,
	onProgress: (progreso) => {
		const porcentaje = Math.floor(progreso * 10) * 10;
		if (porcentaje > ultimoPorcentaje) {
			ultimoPorcentaje = porcentaje;
			console.log(`    ${porcentaje}%`);
		}
	},
});
const {captions} = toCaptions({whisperCppOutput: resultado});
// Recorta las palabras que Whisper estira sobre las pausas, para que los
// subtítulos no se queden en pantalla durante los silencios.
const palabras = ajustarPalabras(
	captions.filter((c) => c.text.trim() !== '' && !/^\[.*\]$/.test(c.text.trim())),
	detectarSilencios(audio),
);
guardarJson(RUTA_TRANSCRIPCION, palabras);

// Versión legible: una frase por línea con su tiempo en el video ORIGINAL.
const lineas = [];
let actual = null;
for (const p of palabras) {
	const pausa = actual ? p.startMs - actual.fin : 0;
	if (!actual || pausa > 400 || /[.?!]$/.test(actual.texto) || actual.n >= 12) {
		if (actual) {
			lineas.push(actual);
		}
		actual = {inicio: p.startMs, fin: p.endMs, texto: p.text.trim(), n: 1};
	} else {
		actual.fin = p.endMs;
		actual.texto += p.text;
		actual.n++;
	}
}
if (actual) {
	lineas.push(actual);
}
const s = (ms) => (ms / 1000).toFixed(2).padStart(6);
fs.writeFileSync(
	RUTA_TEXTO,
	`# Transcripción de ${edicion.video} (tiempos en segundos del video ORIGINAL)\n` +
		lineas.map((l) => `[${s(l.inicio)} -> ${s(l.fin)}] ${l.texto}`).join('\n') +
		'\n',
);
fs.rmSync(audio, {force: true});

console.log(`\nListo: ${palabras.length} palabras en ${lineas.length} frases.`);
console.log('Revisa proyecto/transcripcion.txt. Siguiente paso: npm run cortes');
