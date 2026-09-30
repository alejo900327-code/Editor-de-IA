import {AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Animacion} from '../edicion';

const EXTENSIONES_VIDEO = /\.(mp4|mov|webm|m4v)$/i;

// Imagen o clip de apoyo: a pantalla completa o en una ventana sobre el presentador.
export const Broll: React.FC<{animacion: Extract<Animacion, {tipo: 'broll'}>}> = ({animacion}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const opacidad = interpolate(frame, [0, 6, durationInFrames - 6, durationInFrames], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Acercamiento lento (efecto Ken Burns) para que las fotos no se vean estáticas.
	const acercamiento = interpolate(frame, [0, durationInFrames], [1, 1.08]);
	const src = staticFile(`broll/${animacion.archivo}`);
	const estiloMedio: React.CSSProperties = {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		transform: `scale(${acercamiento})`,
	};
	const medio = EXTENSIONES_VIDEO.test(animacion.archivo) ? (
		<OffthreadVideo src={src} muted style={estiloMedio} />
	) : (
		<Img src={src} style={estiloMedio} />
	);

	if (animacion.modo === 'ventana') {
		return (
			<AbsoluteFill style={{opacity: opacidad}}>
				<div
					style={{
						position: 'absolute',
						left: '8%',
						right: '8%',
						top: '8%',
						height: '38%',
						borderRadius: 32,
						overflow: 'hidden',
						boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
						border: '6px solid white',
					}}
				>
					{medio}
				</div>
			</AbsoluteFill>
		);
	}
	return <AbsoluteFill style={{opacity: opacidad, overflow: 'hidden'}}>{medio}</AbsoluteFill>;
};
