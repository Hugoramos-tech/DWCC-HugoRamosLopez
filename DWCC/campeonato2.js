// =====================================================
// PRÁCTICA 3 (PARTE 2) - CAMPEONATO DAW CON VARIOS JUGADORES
// Ejecución: node campeonato2.js
// =====================================================

// ---------- PUNTOS DE CADA RESULTADO ----------
// Un objeto en lugar de un switch: la clave es el resultado y el valor son los puntos
const PUNTOS_RESULTADO = {
  victoria: 3,
  empate: 1,
  derrota: 0,
};

// ---------- CREAR UN JUGADOR ----------
// Si no se indica el curso, vale "2.º DAW" (parámetro por defecto)
function crearJugador(nombre, curso = "2.º DAW") {
  return {
    nombre: nombre,
    curso: curso,
    partidas: [], // resultados de sus partidas
    bonificaciones: [], // puntos adicionales

    // Añade la partida si el resultado existe. Devuelve true o false
    registrarPartida(resultado) {
      // Object.keys da ["victoria", "empate", "derrota"]
      if (!Object.keys(PUNTOS_RESULTADO).includes(resultado)) {
        return false; // no existe: no se cuenta
      }
      this.partidas.push(resultado);
      return true;
    },

    // Añade varias bonificaciones (rest) y devuelve su suma
    aplicarBonificaciones(...bonos) {
      this.bonificaciones.push(...bonos);
      return bonos.reduce((suma, bono) => suma + bono, 0);
    },

    // Cuenta cuántas partidas tienen ese resultado
    contar(resultado) {
      return this.partidas.filter((partida) => partida === resultado).length;
    },

    // Puntos de las partidas + puntos de las bonificaciones
    puntos() {
      const puntosPartidas = this.partidas.reduce(
        (suma, partida) => suma + PUNTOS_RESULTADO[partida],
        0
      );
      const puntosBonos = this.bonificaciones.reduce((suma, bono) => suma + bono, 0);
      return puntosPartidas + puntosBonos;
    },

    // Categoría según los puntos
    categoria() {
      const puntos = this.puntos();
      if (puntos >= 10) {
        return "EXPERTO";
      } else if (puntos >= 7) {
        return "AVANZADO";
      } else if (puntos >= 4) {
        return "INTERMEDIO";
      } else {
        return "PRINCIPIANTE";
      }
    },

    // Texto con los datos del jugador
    resumen() {
      return (
        `${this.nombre} (${this.curso}) - ` +
        `Partidas: ${this.partidas.length}, ` +
        `Puntos: ${this.puntos()}, ` +
        `Categoría: ${this.categoria()}`
      );
    },
  };
}

// Crea un jugador con sus partidas y bonificaciones de una sola vez
function crearJugadorCompleto(nombre, resultados, ...bonos) {
  const jugador = crearJugador(nombre);
  resultados.forEach((resultado) => jugador.registrarPartida(resultado));
  jugador.aplicarBonificaciones(...bonos);
  return jugador;
}

// ---------- CLASIFICACIÓN DEL CAMPEONATO ----------

// Devuelve el jugador con ese nombre, o undefined si no existe
function buscarJugador(lista, nombre) {
  return lista.find((jugador) => jugador.nombre === nombre);
}

// Clasificación ordenada: puntos, luego victorias, luego orden alfabético
function clasificacion(lista) {
  return [...lista] // copia, para no cambiar el orden del array original
    .sort(
      (a, b) =>
        b.puntos() - a.puntos() || // más puntos primero
        b.contar("victoria") - a.contar("victoria") || // si empatan, más victorias
        a.nombre.localeCompare(b.nombre) // si siguen empatados, alfabético
    )
    .map((jugador, indice) => ({
      posicion: indice + 1,
      nombre: jugador.nombre,
      puntos: jugador.puntos(),
      categoria: jugador.categoria(),
    }));
}

// Agrupa los nombres por categoría (las 4 categorías aparecen siempre)
function jugadoresPorCategoria(lista) {
  const grupos = {
    PRINCIPIANTE: [],
    INTERMEDIO: [],
    AVANZADO: [],
    EXPERTO: [],
  };
  lista.forEach((jugador) => {
    grupos[jugador.categoria()].push(jugador.nombre);
  });
  return grupos;
}

// Totales del campeonato y media de puntos
function estadisticas(lista) {
  const totalPuntos = lista.reduce((suma, jugador) => suma + jugador.puntos(), 0);
  // Si no hay jugadores la media es 0 (así evitamos dividir entre 0)
  const media = lista.length === 0 ? 0 : totalPuntos / lista.length;

  return {
    totalPartidas: lista.reduce((suma, j) => suma + j.partidas.length, 0),
    victorias: lista.reduce((suma, j) => suma + j.contar("victoria"), 0),
    empates: lista.reduce((suma, j) => suma + j.contar("empate"), 0),
    derrotas: lista.reduce((suma, j) => suma + j.contar("derrota"), 0),
    mediaPuntos: Math.round(media * 100) / 100, // 2 decimales
  };
}

// Nombres de los que han jugado y no han perdido ninguna
function invictos(lista) {
  return lista
    .filter((jugador) => jugador.partidas.length > 0 && jugador.contar("derrota") === 0)
    .map((jugador) => jugador.nombre);
}

// Muestra la clasificación por consola
function mostrarClasificacion(lista) {
  console.log("POS  JUGADOR     PUNTOS  CATEGORÍA");
  console.log("-----------------------------------");
  clasificacion(lista).forEach((fila) => {
    console.log(
      `${String(fila.posicion).padEnd(5)}` +
        `${fila.nombre.padEnd(12)}` +
        `${String(fila.puntos).padEnd(8)}` +
        `${fila.categoria}`
    );
  });
}

// ---------- OPERACIONES ESPECIALES ----------
// Reciben unos puntos y devuelven los puntos nuevos (no tocan al jugador)
const duplicarPuntos = (puntos) => puntos * 2;
const anadirPuntosExtra = (puntos, extra = 1) => puntos + extra;
const aplicarPenalizacion = (puntos, penalizacion = 1) => Math.max(0, puntos - penalizacion);

// Aplica una operación a todos los jugadores y devuelve un array NUEVO
function aplicarOperacion(lista, operacion) {
  return lista.map((jugador) => ({
    nombre: jugador.nombre,
    puntos: operacion(jugador.puntos()),
  }));
}

// Copia independiente: copiamos el objeto y también sus dos arrays con spread
function copiarJugador(jugador) {
  return {
    ...jugador,
    partidas: [...jugador.partidas],
    bonificaciones: [...jugador.bonificaciones],
  };
}

// Une varios arrays de jugadores en uno nuevo (rest)
function unirCampeonatos(...listas) {
  return listas.flat();
}

// =====================================================
// CREACIÓN DE JUGADORES Y PRUEBAS
// =====================================================

const jugadores = [
  crearJugadorCompleto("Ana", ["victoria", "victoria", "empate", "derrota", "victoria"], 2),
  crearJugadorCompleto("Brais", ["empate", "empate", "derrota", "victoria"]),
  crearJugadorCompleto("Carla", ["victoria", "victoria", "victoria", "empate"]),
  crearJugadorCompleto("Diego", ["victoria", "victoria", "empate", "empate", "empate", "empate"]),
  crearJugadorCompleto("Eva", ["derrota", "derrota", "empate"], 1, 1),
  crearJugadorCompleto("Fran", ["victoria", "empate", "derrota"], 3),
];

console.log("\nPRUEBA 1: resumen de cada jugador (Ana = 12 EXPERTO, Eva = 3 PRINCIPIANTE)");
jugadores.forEach((jugador) => console.log("  " + jugador.resumen()));

console.log("\nPRUEBA 2: resultado que no existe");
const ana = buscarJugador(jugadores, "Ana");
console.log("  registrarPartida('ganada') ->", ana.registrarPartida("ganada"));
console.log("  Partidas de Ana (siguen siendo 5):", ana.partidas.length);

console.log("\nPRUEBA 3: bonificaciones variables (devuelve la suma)");
const prueba = crearJugador("Prueba");
console.log("  aplicarBonificaciones(2, 1, 3) ->", prueba.aplicarBonificaciones(2, 1, 3));
console.log("  Sin bonificaciones ->", prueba.aplicarBonificaciones());

console.log("\nPRUEBA 4: buscarJugador");
console.log("  Buscar 'Eva':", buscarJugador(jugadores, "Eva").nombre);
console.log("  Buscar 'Zoe':", buscarJugador(jugadores, "Zoe"));

console.log("\nPRUEBA 5: clasificación (Carla y Diego empatan a 10, gana Carla por victorias)");
mostrarClasificacion(jugadores);
console.log("  Orden del array original:", jugadores.map((j) => j.nombre).join(", "));

console.log("\nPRUEBA 6: empate a puntos y victorias -> orden alfabético");
const adela = crearJugadorCompleto("Adela", ["derrota", "derrota", "empate"], 1, 1);
mostrarClasificacion(unirCampeonatos(jugadores, [adela]));

console.log("\nPRUEBA 7: jugadores por categoría");
console.log(jugadoresPorCategoria(jugadores));
console.log("  Lista vacía:", jugadoresPorCategoria([]));

console.log("\nPRUEBA 8: estadísticas");
console.log(estadisticas(jugadores));
console.log("  Lista vacía:", estadisticas([]));

console.log("\nPRUEBA 9: invictos");
console.log("  Invictos:", invictos(jugadores));
console.log("  Jugador sin partidas:", invictos([crearJugador("Nuevo")]));

console.log("\nPRUEBA 10: operaciones especiales sobre todo el campeonato");
console.log("  Duplicar:", aplicarOperacion(jugadores, duplicarPuntos));
console.log("  Extra (por defecto +1):", aplicarOperacion(jugadores, (p) => anadirPuntosExtra(p)));
console.log("  Extra +5:", aplicarOperacion(jugadores, (p) => anadirPuntosExtra(p, 5)));
console.log("  Penalización 4:", aplicarOperacion(jugadores, (p) => aplicarPenalizacion(p, 4)));
console.log("  Puntos reales de Ana (sin cambios):", ana.puntos());

console.log("\nPRUEBA 11: la copia no afecta al original");
const copia = copiarJugador(ana);
copia.registrarPartida("victoria");
copia.aplicarBonificaciones(5);
console.log("  Original -> partidas:", ana.partidas.length, "| puntos:", ana.puntos());
console.log("  Copia    -> partidas:", copia.partidas.length, "| puntos:", copia.puntos());

console.log("\nPRUEBA 12: unirCampeonatos");
const grupoA = [jugadores[0], jugadores[1]];
const grupoB = [jugadores[2]];
const grupoC = [jugadores[3], jugadores[4], jugadores[5]];
const todos = unirCampeonatos(grupoA, grupoB, grupoC);
console.log("  Jugadores unidos:", todos.map((j) => j.nombre).join(", "));
console.log("  Arrays originales sin cambios:", grupoA.length, grupoB.length, grupoC.length);
