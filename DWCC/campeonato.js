// Práctica 3 (parte 1) - Campeonato DAW con un jugador
// Hugo Ramos López - MP0612 Desarrollo web en entorno cliente
// Se ejecuta con: node campeonato.js

const PUNTOS_VICTORIA = 3;
const PUNTOS_EMPATE = 1;
const PUNTOS_DERROTA = 0;

// Crea el jugador. Si no se indica el nivel, empieza en 1
function crearJugador(nombre, nivel = 1) {
  return {
    nombre: nombre,
    nivel: nivel,
    puntos: 0,
    partidasJugadas: 0,
  };
}

// Puntos de un resultado, o null si ese resultado no existe
function obtenerPuntosResultado(resultado) {
  switch (resultado) {
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

// Registra una partida. Devuelve true si se ha contado y false si no
function registrarPartida(jugador, resultado) {
  const puntos = obtenerPuntosResultado(resultado);

  if (puntos === null) {
    console.log("  El resultado \"" + resultado + "\" no existe, no se cuenta");
    return false;
  }

  jugador.puntos += puntos;
  jugador.partidasJugadas++;
  console.log("  Partida registrada: " + resultado + " (+" + puntos + " puntos)");
  return true;
}

// Registra varias partidas de golpe y devuelve cuántas se han contado
function registrarPartidas(jugador, ...resultados) {
  let registradas = 0;

  for (const resultado of resultados) {
    if (registrarPartida(jugador, resultado)) {
      registradas++;
    }
  }

  return registradas;
}

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

// Suma una cantidad variable de bonificaciones y se las da al jugador
function aplicarBonificaciones(jugador, ...bonificaciones) {
  let total = 0;
  for (const bonificacion of bonificaciones) {
    total += bonificacion;
  }

  jugador.puntos += total;
  console.log("  Bonificaciones: +" + total + " puntos");
  return total;
}

// Operaciones especiales
const duplicarPuntos = (jugador) => {
  jugador.puntos *= 2;
  console.log("  Puntos duplicados");
};

const anadirPuntosExtra = (jugador, extra = 1) => {
  jugador.puntos += extra;
  console.log("  Puntos extra: +" + extra);
};

// Los puntos nunca bajan de 0
const aplicarPenalizacion = (jugador, penalizacion = 1) => {
  jugador.puntos = Math.max(0, jugador.puntos - penalizacion);
  console.log("  Penalización: -" + penalizacion);
};

function mostrarResumen(jugador) {
  console.log("  Jugador: " + jugador.nombre + " (nivel " + jugador.nivel + ")");
  console.log("  Partidas jugadas: " + jugador.partidasJugadas);
  console.log("  Puntos: " + jugador.puntos);
  console.log("  Categoría: " + calcularCategoria(jugador.puntos));
}

// ----- Pruebas -----

console.log("\n1) Victoria, empate y derrota");
const ana = crearJugador("Ana", 2);
registrarPartida(ana, "victoria");
registrarPartida(ana, "empate");
registrarPartida(ana, "derrota");
mostrarResumen(ana);

console.log("\n2) Un resultado que no existe");
const luis = crearJugador("Luis"); // nivel 1 por defecto
registrarPartida(luis, "victoria");
registrarPartida(luis, "ganada");
registrarPartida(luis, "");
mostrarResumen(luis);

console.log("\n3) Varias partidas de un array con spread");
const resultadosMaria = ["victoria", "victoria", "empate", "derrota", "empate"];
const maria = crearJugador("María", 3);
console.log("  Partidas contadas: " + registrarPartidas(maria, ...resultadosMaria));
mostrarResumen(maria);

console.log("\n4) Bonificaciones");
const pablo = crearJugador("Pablo");
registrarPartida(pablo, "empate");
aplicarBonificaciones(pablo, 2, 1, 3);
aplicarBonificaciones(pablo); // sin bonificaciones
const bonosExtra = [1, 1, 1];
aplicarBonificaciones(pablo, ...bonosExtra);
mostrarResumen(pablo);

console.log("\n5) Operaciones especiales");
const carla = crearJugador("Carla");
registrarPartidas(carla, "victoria", "empate");
duplicarPuntos(carla);
anadirPuntosExtra(carla);
anadirPuntosExtra(carla, 5);
aplicarPenalizacion(carla, 4);
mostrarResumen(carla);

console.log("\n6) La penalización no deja puntos negativos");
aplicarPenalizacion(luis, 100);
mostrarResumen(luis);

console.log("\n7) Límites de las categorías");
for (const puntos of [0, 3, 4, 6, 7, 9, 10, 25]) {
  console.log("  " + puntos + " puntos -> " + calcularCategoria(puntos));
}
