import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Animacion, Lado} from '../edicion';
import {alturaPosicion} from './Titulo';

const izquierdaPorLado: Record<Lado, string> = {
	izquierda: '22%',
	centro: '50%',
	derecha: '78%',
};

// Emoji que entra rebotando, flota suavemente y sale encogiéndose.
export const Emoji: React.FC<{animacion: Extract<Animacion, {tipo: 'emoji'}>}> = ({animacion}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width, height} = useVideoConfig();
	const entrada = spring({frame, fps, config: {damping: 8, stiffness: 160}});
	const salida = spring({frame: frame - (durationInFrames - 8), fps, config: {damping: 200}, durationInFrames: 8});
	const flotar = Math.sin((frame / fps) * Math.PI * 1.5) * 12;
	const giro = interpolate(entrada, [0, 1], [-25, 0]) + Math.sin((frame / fps) * Math.PI) * 4;
	const tamano = (animacion.tamano ?? 180) * (Math.min(width, height) / 1080);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: izquierdaPorLado[animacion.lado ?? 'derecha'],
					top: alturaPosicion[animacion.posicion ?? 'arriba'],
					fontSize: tamano,
					lineHeight: 1,
					transform: `translate(-50%, calc(-50% + ${flotar}px)) rotate(${giro}deg) scale(${entrada * (1 - salida)})`,
					filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.35))',
				}}
			>
				{animacion.emoji}
			</div>
		</AbsoluteFill>
	);
};
