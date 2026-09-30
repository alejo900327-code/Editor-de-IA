import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Animacion, Posicion} from '../edicion';
import {FUENTE_PRINCIPAL} from '../fuentes';

export const alturaPosicion: Record<Posicion, string> = {
	arriba: '16%',
	centro: '45%',
	abajo: '58%',
};

export const Titulo: React.FC<{animacion: Extract<Animacion, {tipo: 'titulo'}>}> = ({animacion}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const entrada = spring({frame, fps, config: {damping: 12, stiffness: 180}});
	const salida = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: alturaPosicion[animacion.posicion ?? 'arriba'],
					display: 'flex',
					justifyContent: 'center',
					opacity: salida,
					transform: `translateY(-50%) scale(${interpolate(entrada, [0, 1], [0.4, 1])})`,
				}}
			>
				<div
					style={{
						maxWidth: '86%',
						padding: '18px 36px',
						borderRadius: 24,
						backgroundColor: animacion.fondo ?? '#FFD400',
						color: animacion.color ?? '#111111',
						fontFamily: FUENTE_PRINCIPAL,
						fontWeight: 800,
						fontSize: 78,
						lineHeight: 1.1,
						textAlign: 'center',
						boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
					}}
				>
					{animacion.texto}
				</div>
			</div>
		</AbsoluteFill>
	);
};
