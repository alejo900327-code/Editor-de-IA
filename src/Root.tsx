import {Composition} from 'remotion';
import {calcularLinea, edicion} from './edicion';
import {EditorIA} from './EditorIA';

export const RemotionRoot: React.FC = () => {
	const {ancho, alto, fps} = edicion.formato;
	const linea = calcularLinea(edicion);
	return (
		<Composition
			id="EditorIA"
			component={EditorIA}
			durationInFrames={Math.max(linea.totalFrames, fps * 3)}
			fps={fps}
			width={ancho}
			height={alto}
		/>
	);
};
