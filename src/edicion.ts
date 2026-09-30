// Lee proyecto/edicion.json y traduce los tiempos del video original
// (segundos, que es como Claude y el alumno piensan) a frames del video final.
import type {Caption} from '@remotion/captions';
import datos from '../proyecto/edicion.json';
import datosTranscripcion from '../proyecto/transcripcion.json';

export type Posicion = 'arriba' | 'centro' | 'abajo';
export type Lado = 'izquierda' | 'centro' | 'derecha';
export type Esquina = 'arriba-izquierda' | 'arriba-derecha' | 'abajo-izquierda' | 'abajo-derecha';

export type Tramo = {desde: number; hasta: number};

export type Animacion =
	| {
			tipo: 'titulo';
			en: number;
			duracion: number;
			texto: string;
			posicion?: Posicion;
			color?: string;
			fondo?: string;
	  }
	| {
			tipo: 'imagen';
			en: number;
			duracion: number;
			archivo: string;
			posicion?: Posicion;
			ancho?: number;
	  }
	| {tipo: 'zoom'; en: number; duracion: number; escala?: number}
	| {
			tipo: 'emoji';
			en: number;
			duracion: number;
			emoji: string;
			posicion?: Posicion;
			lado?: Lado;
			tamano?: number;
	  }
	| {
			tipo: 'broll';
			en: number;
			duracion: number;
			archivo: string;
			modo?: 'completo' | 'ventana';
	  }
	| {tipo: 'sonido'; en: number; archivo: string; volumen?: number};

export type EstiloSubtitulos = {
	activos: boolean;
	fuente: string;
	tamano: number;
	color: string;
	colorResaltado: string;
	borde: string;
	posicionVertical: number;
	mayusculas: boolean;
	msPorPagina: number;
};

export type Encuadre = 'llenar' | 'ajustar' | 'desenfocado';

export type Edicion = {
	video: string | null;
	duracionOriginal: number;
	formato: {ancho: number; alto: number; fps: number};
	encuadre: Encuadre;
	volumenVoz: number;
	cortes: Tramo[];
	subtitulos: EstiloSubtitulos;
	estiloTitulos?: {fondo: string; color: string};
	marcaDeAgua?: {archivo: string | null; esquina: Esquina; ancho: number; opacidad: number};
	sonidos?: {
		activos: boolean;
		volumen: number;
		alTitulo: string | null;
		alZoom: string | null;
		alEmoji: string | null;
		alBroll: string | null;
	};
	animaciones: Animacion[];
	musica: {archivo: string | null; volumen: number};
	barraProgreso: boolean;
};

export const FORMATOS = {
	vertical: {ancho: 1080, alto: 1920},
	horizontal: {ancho: 1920, alto: 1080},
	cuadrado: {ancho: 1080, alto: 1080},
} as const;

export type NombreFormato = keyof typeof FORMATOS;

// Props que permiten exportar otra versión sin tocar edicion.json.
export type PropsVersion = {formato?: NombreFormato; encuadre?: Encuadre};

export const edicion = datos as Edicion;
export const transcripcion = datosTranscripcion as Caption[];

export type TramoEnLinea = Tramo & {
	inicioFrame: number;
	frames: number;
	trimBefore: number;
};

export type Linea = {tramos: TramoEnLinea[]; totalFrames: number; fps: number};

// Sin cortes definidos se usa el video completo.
export const calcularLinea = (e: Edicion): Linea => {
	const {fps} = e.formato;
	const cortes =
		e.cortes.length > 0
			? e.cortes
			: e.duracionOriginal > 0
				? [{desde: 0, hasta: e.duracionOriginal}]
				: [];
	let acumulado = 0;
	const tramos = cortes.map((t) => {
		const inicioFrame = Math.round(acumulado * fps);
		acumulado += t.hasta - t.desde;
		return {
			...t,
			inicioFrame,
			frames: Math.round(acumulado * fps) - inicioFrame,
			trimBefore: Math.round(t.desde * fps),
		};
	});
	return {tramos, totalFrames: Math.round(acumulado * fps), fps};
};

// Segundo del original -> segundo del video final. Si ese momento fue cortado,
// devuelve null, o el inicio del siguiente tramo cuando ajustar = true.
export const aSegundoFinal = (
	linea: Linea,
	t: number,
	ajustar = false,
): number | null => {
	for (const tramo of linea.tramos) {
		if (t >= tramo.desde && t < tramo.hasta) {
			return tramo.inicioFrame / linea.fps + (t - tramo.desde);
		}
		if (ajustar && t < tramo.desde) {
			return tramo.inicioFrame / linea.fps;
		}
	}
	return null;
};

// Subtítulos en la línea de tiempo final: se descartan las palabras cortadas.
export const subtitulosEnLinea = (linea: Linea, captions: Caption[]) => {
	const resultado: Caption[] = [];
	for (const [i, c] of captions.entries()) {
		const tramo = linea.tramos.find(
			(t) => c.startMs / 1000 >= t.desde && c.startMs / 1000 < t.hasta,
		);
		if (!tramo) {
			continue;
		}
		const base = tramo.inicioFrame / linea.fps - tramo.desde;
		const fin = Math.min(c.endMs / 1000, tramo.hasta);
		// Cambia de subtítulo al final de cada frase y en cada corte.
		const siguiente = captions[i + 1];
		const finDeTramo = !siguiente || siguiente.startMs / 1000 >= tramo.hasta;
		resultado.push({
			...c,
			pageBreakAfter: c.pageBreakAfter || finDeTramo || /[.?!…]$/.test(c.text.trim()),
			startMs: (c.startMs / 1000 + base) * 1000,
			endMs: (fin + base) * 1000,
			timestampMs: c.timestampMs === null ? null : (c.timestampMs / 1000 + base) * 1000,
		});
	}
	return resultado;
};
