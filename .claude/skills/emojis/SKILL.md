---
name: emojis
description: Agrega emojis animados que rebotan junto a palabras clave del video (🔥 💰 ✅ ❌ 🚀 🤯). Úsala cuando el usuario pida emojis, stickers, iconos, reacciones o hacer el video más divertido o dinámico.
---

# Emojis animados

Cada emoji es una animación de tipo `emoji` en `proyecto/edicion.json`: entra rebotando,
flota y sale encogiéndose. Si los sonidos automáticos están activos, suena un "pop".

```json
{"tipo": "emoji", "en": 8.3, "duracion": 1.5, "emoji": "💰", "posicion": "centro", "lado": "derecha", "tamano": 180}
```

| Campo | Valores |
|---|---|
| `posicion` | `arriba`, `centro`, `abajo` (altura) |
| `lado` | `izquierda`, `centro`, `derecha` |
| `tamano` | 120 discreto, 180 normal, 260 protagonista |
| `duracion` | 1-2 segundos |

## Cómo elegirlos

Lee `proyecto/transcripcion.txt` y pon un emoji solo donde **refuerza** una palabra:

| Idea | Emoji |
|---|---|
| Dinero, ganancias, ventas | 💰 💸 📈 |
| Pérdida, error, "no hagas esto" | ❌ 📉 ⚠️ |
| Correcto, "haz esto" | ✅ 👍 |
| Energía, tendencia, algo top | 🔥 🚀 |
| Sorpresa, dato impactante | 🤯 😱 |
| Idea, consejo | 💡 |
| Tiempo, rapidez | ⏰ ⚡ |
| Pregunta, duda | 🤔 ❓ |

## Reglas

- Como mucho uno cada 4-6 segundos, y nunca a la vez que un título o un b-roll.
- Ponlo **al lado** de la cara (`lado: "izquierda"` o `"derecha"`), nunca encima.
- No lo pongas a la altura de los subtítulos (`posicion: "abajo"` con subtítulos en 0.7 choca).
- En temas serios (salud, pérdidas, duelo) pregunta antes o usa muy pocos.
- Los emojis se ven con la fuente de emojis del sistema: en Mac y Windows salen a color.
  Confírmalo en la muestra.

Al terminar: `npm run revisar` y una muestra con un emoji: `npm run exportar -- --muestra <segundo>`.
