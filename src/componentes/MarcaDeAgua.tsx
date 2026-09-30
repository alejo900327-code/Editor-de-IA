import {AbsoluteFill, Img, staticFile} from 'remotion';
import type {Esquina} from '../edicion';

const posicionPorEsquina: Record<Esquina, React.CSSProperties> = {
	'arriba-izquierda': {top: '4%', left: '5%'},
	'arriba-derecha': {top: '4%', right: '5%'},
	'abajo-izquierda': {bottom: '4%', left: '5%'},
	'abajo-derecha': {bottom: '4%', right: '5%'},
};

// Logo fijo durante todo el video.
export const MarcaDeAgua: React.FC<{archivo: string; esquina: Esquina; ancho: number; opacidad: number}> = ({
	archivo,
	esquina,
	ancho,
	opacidad,
}) => (
	<AbsoluteFill>
		<Img
			src={staticFile(`imagenes/${archivo}`)}
			style={{position: 'absolute', width: `${ancho}%`, opacity: opacidad, ...posicionPorEsquina[esquina]}}
		/>
	</AbsoluteFill>
);
