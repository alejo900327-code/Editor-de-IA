---
name: instalar-editor
description: Instala y comprueba todo lo necesario para editar videos en este proyecto (Node, dependencias, Whisper y exportación). Úsala la primera vez que se abre el proyecto o cuando algo del editor no funciona.
---

# Instalar el editor

Guía al usuario paso a paso. Es principiante: explica cada paso en una frase y avisa
cuando algo tarde. Ejecuta tú los comandos; pídele que haga algo solo cuando tú no puedas
(por ejemplo, instalar un programa con instalador gráfico).

## 1. Comprueba el sistema

Ejecuta `node --version` y `npm --version`.

- Si Node no está instalado o es menor que 18: pídele que instale la versión **LTS** desde
  https://nodejs.org (botón verde), que cierre y vuelva a abrir Claude Code, y que te avise.
  No sigas hasta que funcione.
- En **Mac**, comprueba `xcode-select -p`. Si falla, pídele que ejecute
  `xcode-select --install` en la Terminal y acepte la ventana (hace falta para compilar Whisper).
- En **Windows** no hace falta nada más: Whisper se descarga ya compilado.

## 2. Instala las dependencias

Ejecuta `npm install` en la carpeta del proyecto. Tarda de 1 a 3 minutos la primera vez.
Si falla por red o permisos, muestra el error en palabras simples y reintenta una vez.

## 3. Comprueba la vista previa y la exportación

1. Ejecuta `npm run revisar`. Si solo avisa de que no hay video, está bien.
2. Ejecuta `npm run exportar -- --muestra`. La primera vez Remotion descarga su navegador
   interno (~100 MB). Debe crearse un MP4 en `entregas/` con el texto "Aún no hay video".
   Después bórralo.

## 4. Whisper (transcripción gratis y local)

Whisper se instala automáticamente la primera vez que se ejecuta `npm run transcribir`
(instala el programa y descarga el modelo `small`, ~470 MB). Avísale de que esa primera
vez tarda varios minutos y necesita internet; después funciona sin conexión.

Si el usuario ya tiene un video, ofrécele seguir con `/editar-video`.

## Si algo falla

- `npm` no se reconoce: Node no está instalado o falta reiniciar Claude Code.
- Error de compilación de Whisper en Mac: falta `xcode-select --install`.
- Antivirus en Windows que bloquea `main.exe` de Whisper: pide permitirlo en la carpeta `.whisper`.
- Falta de espacio: se necesitan unos 2 GB libres.

Termina con un resumen: qué quedó instalado, qué falta (si algo) y el siguiente paso.
