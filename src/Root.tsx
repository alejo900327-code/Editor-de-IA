import {Composition} from 'remotion';
import {calcularLinea, edicion, FORMATOS, type PropsVersion} from './edicion';
import {EditorIA} from './EditorIA';

export const RemotionRoot: React.FC = () => {
	const {ancho, alto, fps} = edicion.formato;
	const linea = calcularLinea(edicion);
	const props: PropsVersion = {};
	return (
		<Composition
			id="EditorIA"
			component={EditorIA}
			durationInFrames={Math.max(linea.totalFrames, fps * 3)}
			fps={fps}
			width={ancho}
			height={alto}
			defaultProps={props}
			// "npm run exportar -- --formato cuadrado" cambia el tamaño sin tocar edicion.json.
			calculateMetadata={({props: p}) => {
				const {formato} = p as PropsVersion;
				return formato ? {width: FORMATOS[formato].ancho, height: FORMATOS[formato].alto} : {};
			}}
		/>
	);
};
