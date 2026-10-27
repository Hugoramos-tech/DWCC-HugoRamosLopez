// =====================================================
// PRÁCTICA 3 - TEMA 2 JAVASCRIPT
// MP0612 - Desarrollo web en entorno cliente
// Campeonato DAW: gestión de resultados de un participante
// Ejecución: node campeonato.js
// =====================================================

// ---------- CONSTANTES ----------
const PUNTOS_VICTORIA = 3;
const PUNTOS_EMPATE = 1;
const PUNTOS_DERROTA = 0;

// ---------- CREACIÓN DEL JUGADOR ----------
// Parámetro por defecto: si no se indica nivel, empieza en 1
function crearJugador(nombre, nivel = 1) {
  return {
    nombre: nombre,
    nivel: nivel,
    puntos: 0,
    partidasJugadas: 0,
  };
}

// ---------- RESULTADOS ----------
// Devuelve los puntos de un resultado, o null si el resultado no existe
function obtenerPuntosResultado(resultado) {
  switch (resultado.toLowerCase()) {
    case "victoria":
      return PUNTOS_VICTORIA;
    case "empate":
      return PUNTOS_EMPATE;
    case "derrota":
      return PUNTOS_DERROTA;
    default:
      return null;
  }
}

// Registra una partida. Devuelve true si se contabilizó y false si no
function registrarPartida(jugador, resultado) {
  const puntos = obtenerPuntosResultado(resultado);

  if (puntos === null) {
    console.log(`  [AVISO] Resultado "${resultado}" no válido. Partida no contabilizada.`);
    return false;
  }

  jugador.puntos += puntos;
  jugador.partidasJugadas++;
  console.log(`  Partida registrada: ${resultado} (+${puntos} puntos)`);
  return true;
}

// Registra varias partidas de golpe usando rest (...resultados)
function registrarPartidas(jugador, ...resultados) {
  let registradas = 0;

  for (const resultado of resultados) {
    if (registrarPartida(jugador, resultado)) {
      registradas++;
    }
  }

  return registradas;
}

// ---------- CLASIFICACIÓN ----------
function calcularCategoria(puntos) {
  if (puntos >= 10) {
    return "EXPERTO";
  } else if (puntos >= 7) {
    return "AVANZADO";
  } else if (puntos >= 4) {
    return "INTERMEDIO";
  } else {
    return "PRINCIPIANTE";
  }
}

// ---------- BONIFICACIONES ----------
// Suma una cantidad variable de bonificaciones (rest)
const sumarBonificaciones = (...bonificaciones) => {
  let total = 0;
  for (const bonificacion of bonificaciones) {
    total += bonificacion;
  }
  return total;
};

function aplicarBonificaciones(jugador, ...bonificaciones) {
  const total = sumarBonificaciones(...bonificaciones);
  jugador.puntos += total;
  console.log(`  Bonificaciones [${bonificaciones.join(", ")}] -> +${total} puntos`);
}

// ---------- OPERACIONES ESPECIALES (arrow functions) ----------
const duplicarPuntos = (jugador) => {
  jugador.puntos *= 2;
  console.log("  Puntos duplicados.");
};

// Parámetro por defecto: si no se indica, se añade 1 punto
const anadirPuntosExtra = (jugador, extra = 1) => {
  jugador.puntos += extra;
  console.log(`  Puntos extra añadidos: +${extra}`);
};

// La puntuación nunca puede quedar por debajo de 0
const aplicarPenalizacion = (jugador, penalizacion = 1) => {
  jugador.puntos = Math.max(0, jugador.puntos - penalizacion);
  console.log(`  Penalización aplicada: -${penalizacion}`);
};

// ---------- RESUMEN ----------
function mostrarResumen(jugador) {
  console.log("  ----- RESUMEN -----");
  console.log(`  Jugador:          ${jugador.nombre}`);
  console.log(`  Nivel:            ${jugador.nivel}`);
  console.log(`  Partidas jugadas: ${jugador.partidasJugadas}`);
  console.log(`  Puntos:           ${jugador.puntos}`);
  console.log(`  Categoría:        ${calcularCategoria(jugador.puntos)}`);
  console.log("  -------------------");
}

// =====================================================
// PRUEBAS
// =====================================================

console.log("\nPRUEBA 1: partidas sueltas (victoria, empate, derrota)");
const ana = crearJugador("Ana", 2);
registrarPartida(ana, "victoria");
registrarPartida(ana, "empate");
registrarPartida(ana, "derrota");
mostrarResumen(ana); // 4 puntos, 3 partidas -> INTERMEDIO

console.log("\nPRUEBA 2: resultado inexistente (no debe contabilizarse)");
const luis = crearJugador("Luis"); // nivel por defecto = 1
registrarPartida(luis, "victoria");
registrarPartida(luis, "ganada");
registrarPartida(luis, "");
mostrarResumen(luis); // 3 puntos, 1 partida -> PRINCIPIANTE

console.log("\nPRUEBA 3: varias partidas con rest y spread");
const resultadosMaria = ["victoria", "victoria", "empate", "derrota", "empate"];
const maria = crearJugador("María", 3);
const contabilizadas = registrarPartidas(maria, ...resultadosMaria); // spread
console.log(`  Partidas contabilizadas: ${contabilizadas}`);
mostrarResumen(maria); // 8 puntos -> AVANZADO

console.log("\nPRUEBA 4: bonificaciones variables (2, 1 y 3 = 6 puntos)");
const pablo = crearJugador("Pablo");
registrarPartida(pablo, "empate");
aplicarBonificaciones(pablo, 2, 1, 3);
mostrarResumen(pablo); // 1 + 6 = 7 puntos -> AVANZADO

console.log("\nPRUEBA 5: sin bonificaciones y con spread de un array");
aplicarBonificaciones(pablo); // 0 bonificaciones
const bonosExtra = [1, 1, 1];
aplicarBonificaciones(pablo, ...bonosExtra); // 7 + 3 = 10
mostrarResumen(pablo); // 10 puntos -> EXPERTO

console.log("\nPRUEBA 6: operaciones especiales");
const carla = crearJugador("Carla", 1);
registrarPartidas(carla, "victoria", "empate"); // 4 puntos
duplicarPuntos(carla); // 8
anadirPuntosExtra(carla); // +1 por defecto -> 9
anadirPuntosExtra(carla, 5); // 14
aplicarPenalizacion(carla, 4); // 10
mostrarResumen(carla); // EXPERTO

console.log("\nPRUEBA 7: la penalización no deja puntos negativos");
aplicarPenalizacion(luis, 100);
mostrarResumen(luis); // 0 puntos -> PRINCIPIANTE

console.log("\nPRUEBA 8: límites de las categorías");
for (const puntos of [0, 3, 4, 6, 7, 9, 10, 25]) {
  console.log(`  ${puntos} puntos -> ${calcularCategoria(puntos)}`);
}
