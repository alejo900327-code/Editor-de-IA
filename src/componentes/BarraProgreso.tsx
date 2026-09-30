import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {edicion} from '../edicion';

export const BarraProgreso: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					height: 14,
					width: `${(frame / durationInFrames) * 100}%`,
					backgroundColor: edicion.subtitulos.colorResaltado,
				}}
			/>
		</AbsoluteFill>
	);
};
