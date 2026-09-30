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
import {Imagen} from './componentes/Imagen';
import {Subtitulos} from './componentes/Subtitulos';
import {Titulo} from './componentes/Titulo';
import {aSegundoFinal, calcularLinea, edicion, type Linea} from './edicion';

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
		Pídele a Claude: /preparar-video
	</AbsoluteFill>
);

export const EditorIA: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const linea = calcularLinea(edicion);

	if (!edicion.video) {
		return <SinVideo />;
	}

	const video = staticFile(`videos/${edicion.video}`);
	const escala = escalaZoom(linea, frame, fps);

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<AbsoluteFill style={{transform: `scale(${escala})`}}>
				<Series>
					{linea.tramos.map((tramo) => (
						<Series.Sequence key={`${tramo.desde}-${tramo.hasta}`} durationInFrames={tramo.frames}>
							<OffthreadVideo
								src={video}
								trimBefore={tramo.trimBefore}
								volume={edicion.volumenVoz}
								style={{
									width: '100%',
									height: '100%',
									objectFit: edicion.encuadre === 'ajustar' ? 'contain' : 'cover',
								}}
							/>
						</Series.Sequence>
					))}
				</Series>
			</AbsoluteFill>

			{edicion.animaciones.map((a, i) => {
				if (a.tipo === 'zoom') {
					return null;
				}
				const inicio = aSegundoFinal(linea, a.en, true);
				if (inicio === null) {
					return null;
				}
				return (
					<Sequence key={i} from={Math.round(inicio * fps)} durationInFrames={Math.round(a.duracion * fps)}>
						{a.tipo === 'titulo' ? <Titulo animacion={a} /> : <Imagen animacion={a} />}
					</Sequence>
				);
			})}

			{edicion.subtitulos.activos ? <Subtitulos linea={linea} /> : null}
			{edicion.barraProgreso ? <BarraProgreso /> : null}
			{edicion.musica.archivo ? (
				<Audio src={staticFile(`musica/${edicion.musica.archivo}`)} volume={edicion.musica.volumen} loop />
			) : null}
		</AbsoluteFill>
	);
};
