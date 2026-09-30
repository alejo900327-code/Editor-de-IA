// Uso: npm run sincronizar-skills
// Copia las skills de .claude/skills (Claude Code) a .agents/skills (Codex),
// para que los dos agentes usen exactamente las mismas instrucciones.
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ} from './lib.mjs';

const origen = path.join(RAIZ, '.claude', 'skills');
const destino = path.join(RAIZ, '.agents', 'skills');

fs.rmSync(destino, {recursive: true, force: true});
fs.cpSync(origen, destino, {recursive: true});
const nombres = fs.readdirSync(destino).filter((n) => fs.existsSync(path.join(destino, n, 'SKILL.md')));
console.log(`${nombres.length} skills copiadas a .agents/skills: ${nombres.join(', ')}`);
