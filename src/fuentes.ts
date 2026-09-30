// La fuente va incluida en public/fuentes para que funcione sin internet.
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const FUENTE_PRINCIPAL = 'Montserrat';

loadFont({
	family: FUENTE_PRINCIPAL,
	url: staticFile('fuentes/Montserrat-ExtraBold.ttf'),
	weight: '800',
});
