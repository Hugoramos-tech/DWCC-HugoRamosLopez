# Práctica 3 — Campeonato DAW

Hugo Ramos López · MP0612 Desarrollo Web en Entorno Cliente · Tema 2

Son dos programas de consola. Se ejecutan con Node:

```bash
node campeonato.js
node campeonato2.js
```

## Parte 1 — `campeonato.js`

Lleva los resultados de **un** jugador. Victoria 3 puntos, empate 1 y derrota 0. Si el resultado
no existe, avisa y no lo cuenta.

Categorías: 0–3 PRINCIPIANTE, 4–6 INTERMEDIO, 7–9 AVANZADO y 10 o más EXPERTO.

He usado `const` y `let`, operadores, `if`/`else`, `switch`, `for...of`, funciones con
parámetros por defecto, arrow functions, y rest y spread en las bonificaciones y en
`registrarPartidas`.

## Parte 2 — `campeonato2.js`

Amplía el programa a **varios** jugadores con objetos y arrays. Los puntos de cada resultado
están en el objeto `PUNTOS_RESULTADO`, así no hace falta el `switch`.

Cada jugador se crea con `crearJugador(nombre, curso = "2.º DAW")` y tiene los métodos
`registrarPartida`, `aplicarBonificaciones`, `contar`, `puntos`, `categoria` y `resumen`.

Funciones del campeonato: `buscarJugador`, `clasificacion`, `jugadoresPorCategoria`,
`estadisticas`, `invictos` y `mostrarClasificacion`. Operaciones especiales: `aplicarOperacion`,
`copiarJugador` y `unirCampeonatos`.

### Resultados de los seis participantes

| Jugador | Partidas | Puntos | Categoría |
|---|---|---|---|
| Ana | V V E D V + bonif. 2 | 12 | EXPERTO |
| Brais | E E D V | 5 | INTERMEDIO |
| Carla | V V V E | 10 | EXPERTO |
| Diego | V V E E E E | 10 | EXPERTO |
| Eva | D D E + bonif. 1 y 1 | 3 | PRINCIPIANTE |
| Fran | V E D + bonif. 3 | 7 | AVANZADO |

En total son 25 partidas (10 victorias, 10 empates y 5 derrotas) y la media sale 7,83 puntos.
Los invictos son Carla y Diego.

### Casos especiales que pruebo

- Un resultado que no existe: `registrarPartida("ganada")` devuelve `false` y no suma partida.
- Empate a puntos: Carla y Diego tienen 10 puntos y va primera Carla porque tiene más
  victorias. Adela y Eva empatan a puntos y a victorias, así que se ordenan alfabéticamente.
- Una copia no cambia al original: `copiarJugador` copia también los dos arrays con spread.
- `clasificacion` ordena sobre `[...lista]`, así que el array que recibe no cambia de orden.
- Listas vacías en `estadisticas` y `jugadoresPorCategoria` (las cuatro categorías salen
  siempre, aunque estén vacías).
