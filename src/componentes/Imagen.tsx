import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Animacion} from '../edicion';
import {alturaPosicion} from './Titulo';

export const Imagen: React.FC<{animacion: Extract<Animacion, {tipo: 'imagen'}>}> = ({animacion}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const entrada = spring({frame, fps, config: {damping: 200}, durationInFrames: 12});
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
					opacity: Math.min(entrada, salida),
					transform: `translateY(calc(-50% + ${interpolate(entrada, [0, 1], [60, 0])}px))`,
				}}
			>
				<Img
					src={staticFile(`imagenes/${animacion.archivo}`)}
					style={{width: `${animacion.ancho ?? 70}%`, borderRadius: 24}}
				/>
			</div>
		</AbsoluteFill>
	);
};
