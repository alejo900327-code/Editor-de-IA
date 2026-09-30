import {
	AbsoluteFill,
	Audio,
	OffthreadVideo,
	Sequence,
	Series,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {BarraProgreso} from './componentes/BarraProgreso';
import {Broll} from './componentes/Broll';
import {Emoji} from './componentes/Emoji';
import {Imagen} from './componentes/Imagen';
import {MarcaDeAgua} from './componentes/MarcaDeAgua';
import {Subtitulos} from './componentes/Subtitulos';
import {Titulo} from './componentes/Titulo';
import {
	type Animacion,
	aSegundoFinal,
	calcularLinea,
	edicion,
	type Encuadre,
	type Linea,
	type PropsVersion,
} from './edicion';

const DURACION_ZOOM_FRAMES = 10;

// Escala del video en este frame según las animaciones de tipo "zoom".
const escalaZoom = (linea: Linea, frame: number, fps: number) => {
	let escala = 1;
	for (const a of edicion.animaciones) {
		if (a.tipo !== 'zoom') {
			continue;
		}
		const inicio = aSegundoFinal(linea, a.en, true);
		if (inicio === null) {
			continue;
		}
		const desde = Math.round(inicio * fps);
		const hasta = desde + Math.round(a.duracion * fps);
		if (frame < desde || frame >= hasta) {
			continue;
		}
		const config = {damping: 200};
		const entrada = spring({frame: frame - desde, fps, config, durationInFrames: DURACION_ZOOM_FRAMES});
		const salida = spring({frame: hasta - frame, fps, config, durationInFrames: DURACION_ZOOM_FRAMES});
		escala = Math.max(escala, 1 + ((a.escala ?? 1.2) - 1) * Math.min(entrada, salida));
	}
	return escala;
};

// Sonido automático según el tipo de animación (configurable en "sonidos").
const sonidoAutomatico = (a: Animacion): string | null => {
	const s = edicion.sonidos;
	if (!s?.activos) {
		return null;
	}
	switch (a.tipo) {
		case 'titulo':
		case 'imagen':
			return s.alTitulo;
		case 'zoom':
			return s.alZoom;
		case 'emoji':
			return s.alEmoji;
		case 'broll':
			return s.alBroll;
		default:
			return null;
	}
};

const SinVideo: React.FC = () => (
	<AbsoluteFill
		style={{
			backgroundColor: '#111',
			color: 'white',
			justifyContent: 'center',
			alignItems: 'center',
			fontFamily: 'sans-serif',
			fontSize: 56,
			textAlign: 'center',
			padding: 80,
		}}
	>
		Aún no hay video.
		<br />
		Pídele a Claude: /editar-video
	</AbsoluteFill>
);

const VideoPrincipal: React.FC<{linea: Linea; encuadre: Encuadre; fondo?: boolean}> = ({linea, encuadre, fondo}) => {
	const video = staticFile(`videos/${edicion.video}`);
	return (
		<Series>
			{linea.tramos.map((tramo) => (
				<Series.Sequence key={`${tramo.desde}-${tramo.hasta}`} durationInFrames={tramo.frames}>
					<OffthreadVideo
						src={video}
						trimBefore={tramo.trimBefore}
						volume={fondo ? 0 : edicion.volumenVoz}
						muted={fondo}
						style={{
							width: '100%',
							height: '100%',
							objectFit: encuadre === 'llenar' || fondo ? 'cover' : 'contain',
							filter: fondo ? 'blur(40px) brightness(0.6)' : undefined,
							transform: fondo ? 'scale(1.15)' : undefined,
						}}
					/>
				</Series.Sequence>
			))}
		</Series>
	);
};

export const EditorIA: React.FC<PropsVersion> = ({encuadre}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const linea = calcularLinea(edicion);

	if (!edicion.video) {
		return <SinVideo />;
	}

	const modo = encuadre ?? edicion.encuadre;
	const escala = escalaZoom(linea, frame, fps);
	const conTiempo = edicion.animaciones
		.map((a, i) => ({a, i, inicio: aSegundoFinal(linea, a.en, true)}))
		.filter((x): x is {a: Animacion; i: number; inicio: number} => x.inicio !== null);
	const capa = (tipos: Animacion['tipo'][]) =>
		conTiempo
			.filter(({a}) => tipos.includes(a.tipo))
			.map(({a, i, inicio}) => {
				if (a.tipo === 'zoom' || a.tipo === 'sonido') {
					return null;
				}
				return (
					<Sequence key={i} from={Math.round(inicio * fps)} durationInFrames={Math.max(1, Math.round(a.duracion * fps))}>
						{a.tipo === 'titulo' ? <Titulo animacion={a} /> : null}
						{a.tipo === 'imagen' ? <Imagen animacion={a} /> : null}
						{a.tipo === 'emoji' ? <Emoji animacion={a} /> : null}
						{a.tipo === 'broll' ? <Broll animacion={a} /> : null}
					</Sequence>
				);
			});
	const marca = edicion.marcaDeAgua;

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			{modo === 'desenfocado' ? <VideoPrincipal linea={linea} encuadre={modo} fondo /> : null}
			<AbsoluteFill style={{transform: `scale(${escala})`}}>
				<VideoPrincipal linea={linea} encuadre={modo} />
			</AbsoluteFill>

			{capa(['broll'])}
			{capa(['titulo', 'imagen', 'emoji'])}
			{marca?.archivo ? <MarcaDeAgua {...marca} archivo={marca.archivo} /> : null}
			{edicion.subtitulos.activos ? <Subtitulos linea={linea} /> : null}
			{edicion.barraProgreso ? <BarraProgreso /> : null}

			{edicion.musica.archivo ? (
				<Audio src={staticFile(`musica/${edicion.musica.archivo}`)} volume={edicion.musica.volumen} loop />
			) : null}
			{conTiempo.map(({a, i, inicio}) => {
				const archivo = a.tipo === 'sonido' ? a.archivo : sonidoAutomatico(a);
				if (!archivo) {
					return null;
				}
				const volumen = a.tipo === 'sonido' ? (a.volumen ?? 0.6) : (edicion.sonidos?.volumen ?? 0.5);
				return (
					<Sequence key={`sonido-${i}`} from={Math.round(inicio * fps)} durationInFrames={fps * 3}>
						<Audio src={staticFile(`sonidos/${archivo}`)} volume={volumen} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
