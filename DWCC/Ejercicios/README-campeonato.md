# Práctica 3 — Campeonato DAW

**Hugo Ramos López** · MP0612 Desarrollo Web en Entorno Cliente · Tema 2

Dos programas de consola. Se ejecutan con Node:

```bash
node campeonato.js
node campeonato2.js
```

## Parte 1 — `campeonato.js`

Gestiona los resultados de **un** participante. Victoria 3 puntos, empate 1 y derrota 0.
Un resultado que no existe se detecta y no se contabiliza.

Categorías: 0–3 PRINCIPIANTE · 4–6 INTERMEDIO · 7–9 AVANZADO · 10 o más EXPERTO.

Contenidos usados: `let`/`const`, operadores, `if`/`else` y `switch`, bucle `for...of`,
funciones con parámetros, `return` y parámetros por defecto, arrow functions, rest y spread.

Ocho pruebas al final del fichero, incluidas las de resultado inexistente, penalización que no
deja puntos negativos y las fronteras de las cuatro categorías.

## Parte 2 — `campeonato2.js`

Amplía el programa a **varios** jugadores con objetos y arrays. Los puntos de cada resultado
están en el objeto `PUNTOS_RESULTADO`, en lugar de en un `switch`.

Cada jugador se crea con `crearJugador(nombre, curso = "2.º DAW")` y tiene los métodos
`registrarPartida`, `aplicarBonificaciones`, `contar`, `puntos`, `categoria` y `resumen`.

Funciones del campeonato: `buscarJugador`, `clasificacion`, `jugadoresPorCategoria`,
`estadisticas`, `invictos` y `mostrarClasificacion`.
Operaciones especiales: `aplicarOperacion`, `copiarJugador` y `unirCampeonatos`.

### Resultados de los seis participantes

| Jugador | Partidas | Puntos | Categoría |
|---|---|---|---|
| Ana | V V E D V + bonif. 2 | 12 | EXPERTO |
| Brais | E E D V | 5 | INTERMEDIO |
| Carla | V V V E | 10 | EXPERTO |
| Diego | V V E E E E | 10 | EXPERTO |
| Eva | D D E + bonif. 1 y 1 | 3 | PRINCIPIANTE |
| Fran | V E D + bonif. 3 | 7 | AVANZADO |

Totales: 25 partidas (10 victorias, 10 empates, 5 derrotas) y una media de 7,83 puntos.
Invictos: Carla y Diego.

### Casos especiales que se prueban

- Un resultado que no existe (`registrarPartida("ganada")` devuelve `false` y no suma partida).
- **Empate a puntos:** Carla y Diego empatan a 10 y va primero Carla por tener más victorias.
  Con Adela y Eva, empatadas a 3 puntos y a victorias, se ordenan alfabéticamente.
- **Una copia que no afecta al original:** `copiarJugador` duplica también los dos arrays con
  spread, así que registrar partidas en la copia deja al original intacto.
- `clasificacion` trabaja sobre `[...lista]`, por lo que el array recibido no cambia de orden.
- Listas vacías en `estadisticas` y `jugadoresPorCategoria` (las cuatro categorías aparecen
  siempre, aunque estén vacías).
