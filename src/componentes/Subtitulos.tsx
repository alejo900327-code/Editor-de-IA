import {createTikTokStyleCaptions, type TikTokPage} from '@remotion/captions';
import {useMemo} from 'react';
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {edicion, type Linea, subtitulosEnLinea, transcripcion} from '../edicion';
import '../fuentes';

const Pagina: React.FC<{pagina: TikTokPage}> = ({pagina}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const estilo = edicion.subtitulos;
	const tamano = estilo.tamano * (Math.min(width, height) / 1080);
	const ahoraMs = pagina.startMs + (frame / fps) * 1000;
	const entrada = spring({frame, fps, config: {damping: 200}, durationInFrames: 5});

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: '7%',
					right: '7%',
					top: `${estilo.posicionVertical * 100}%`,
					transform: `translateY(-50%) scale(${interpolate(entrada, [0, 1], [0.85, 1])})`,
					textAlign: 'center',
					fontFamily: estilo.fuente,
					fontWeight: 800,
					fontSize: tamano,
					lineHeight: 1.15,
					color: estilo.color,
					textTransform: estilo.mayusculas ? 'uppercase' : 'none',
					WebkitTextStroke: `${Math.round(tamano / 6)}px ${estilo.borde}`,
					paintOrder: 'stroke',
				}}
			>
				{pagina.tokens.map((token) => {
					const activo = token.fromMs <= ahoraMs && token.toMs > ahoraMs;
					return (
						<span
							key={token.fromMs}
							style={{color: activo ? estilo.colorResaltado : estilo.color, whiteSpace: 'pre-wrap'}}
						>
							{token.text}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

export const Subtitulos: React.FC<{linea: Linea}> = ({linea}) => {
	const {fps} = useVideoConfig();
	const paginas = useMemo(
		() =>
			createTikTokStyleCaptions({
				captions: subtitulosEnLinea(linea, transcripcion),
				combineTokensWithinMilliseconds: edicion.subtitulos.msPorPagina,
			}).pages,
		[linea],
	);

	return (
		<>
			{paginas.map((pagina, i) => {
				const siguiente = paginas[i + 1];
				const desde = Math.round((pagina.startMs / 1000) * fps);
				const finMs = siguiente
					? Math.min(siguiente.startMs, pagina.startMs + pagina.durationMs + 400)
					: pagina.startMs + pagina.durationMs;
				const duracion = Math.round((finMs / 1000) * fps) - desde;
				if (duracion <= 0) {
					return null;
				}
				return (
					<Sequence key={i} from={desde} durationInFrames={duracion}>
						<Pagina pagina={pagina} />
					</Sequence>
				);
			})}
		</>
	);
};
