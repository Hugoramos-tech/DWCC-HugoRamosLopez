// Práctica 3 (parte 2) - Campeonato DAW con varios jugadores
// Hugo Ramos López - MP0612 Desarrollo web en entorno cliente
// Se ejecuta con: node campeonato2.js

// Puntos que da cada resultado (un objeto en vez de un switch)
const PUNTOS_RESULTADO = {
  victoria: 3,
  empate: 1,
  derrota: 0,
};

const CATEGORIAS = ["PRINCIPIANTE", "INTERMEDIO", "AVANZADO", "EXPERTO"];

// Crea un jugador. Si no se indica el curso, es "2.º DAW"
function crearJugador(nombre, curso = "2.º DAW") {
  return {
    nombre: nombre,
    curso: curso,
    partidas: [],
    bonificaciones: [],

    // Guarda el resultado si existe y devuelve true, si no devuelve false
    registrarPartida(resultado) {
      if (!Object.keys(PUNTOS_RESULTADO).includes(resultado)) {
        return false;
      }
      this.partidas.push(resultado);
      return true;
    },

    // Añade varias bonificaciones y devuelve lo que suman
    aplicarBonificaciones(...bonos) {
      this.bonificaciones.push(...bonos);
      return bonos.reduce((suma, bono) => suma + bono, 0);
    },

    // Cuántas partidas tiene con ese resultado
    contar(resultado) {
      return this.partidas.filter((partida) => partida === resultado).length;
    },

    // Puntos de las partidas más los de las bonificaciones
    puntos() {
      let total = 0;
      this.partidas.forEach((partida) => {
        total += PUNTOS_RESULTADO[partida];
      });
      this.bonificaciones.forEach((bono) => {
        total += bono;
      });
      return total;
    },

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

    resumen() {
      return this.nombre + " (" + this.curso + ") - partidas: " + this.partidas.length +
        ", puntos: " + this.puntos() + ", categoría: " + this.categoria();
    },
  };
}

// Devuelve el jugador con ese nombre o undefined si no está
function buscarJugador(lista, nombre) {
  return lista.find((jugador) => jugador.nombre === nombre);
}

// Clasificación ordenada por puntos, victorias y nombre
function clasificacion(lista) {
  // Copio la lista con spread para no cambiar el orden del array original
  const ordenados = [...lista].sort((a, b) => {
    if (a.puntos() !== b.puntos()) {
      return b.puntos() - a.puntos();
    }
    if (a.contar("victoria") !== b.contar("victoria")) {
      return b.contar("victoria") - a.contar("victoria");
    }
    return a.nombre.localeCompare(b.nombre);
  });

  return ordenados.map((jugador, i) => ({
    posicion: i + 1,
    nombre: jugador.nombre,
    puntos: jugador.puntos(),
    categoria: jugador.categoria(),
  }));
}

// Nombres agrupados por categoría (siempre salen las cuatro)
function jugadoresPorCategoria(lista) {
  const grupos = {};
  CATEGORIAS.forEach((categoria) => {
    grupos[categoria] = [];
  });

  lista.forEach((jugador) => {
    grupos[jugador.categoria()].push(jugador.nombre);
  });

  return grupos;
}

// Totales del campeonato y media de puntos con dos decimales
function estadisticas(lista) {
  const totalPartidas = lista.reduce((suma, jugador) => suma + jugador.partidas.length, 0);
  const victorias = lista.reduce((suma, jugador) => suma + jugador.contar("victoria"), 0);
  const empates = lista.reduce((suma, jugador) => suma + jugador.contar("empate"), 0);
  const derrotas = lista.reduce((suma, jugador) => suma + jugador.contar("derrota"), 0);
  const totalPuntos = lista.reduce((suma, jugador) => suma + jugador.puntos(), 0);

  // Si la lista está vacía la media es 0, así no divido entre cero
  let mediaPuntos = 0;
  if (lista.length > 0) {
    mediaPuntos = Math.round((totalPuntos / lista.length) * 100) / 100;
  }

  return {
    totalPartidas: totalPartidas,
    victorias: victorias,
    empates: empates,
    derrotas: derrotas,
    mediaPuntos: mediaPuntos,
  };
}

// Nombres de los que han jugado y no han perdido ninguna partida
function invictos(lista) {
  const sinDerrotas = lista.filter(
    (jugador) => jugador.partidas.length > 0 && jugador.contar("derrota") === 0
  );
  return sinDerrotas.map((jugador) => jugador.nombre);
}

function mostrarClasificacion(lista) {
  console.log("CLASIFICACIÓN DEL CAMPEONATO");
  clasificacion(lista).forEach((fila) => {
    console.log(
      fila.posicion + ". " + fila.nombre + " - " + fila.puntos + " puntos (" + fila.categoria + ")"
    );
  });
}

// Operaciones especiales: reciben unos puntos y devuelven los nuevos
const duplicarPuntos = (puntos) => puntos * 2;
const anadirPuntosExtra = (puntos, extra = 1) => puntos + extra;
const aplicarPenalizacion = (puntos, penalizacion = 1) => Math.max(0, puntos - penalizacion);

// Aplica una de esas operaciones a todos los jugadores sin modificarlos
function aplicarOperacion(lista, operacion) {
  return lista.map((jugador) => ({
    nombre: jugador.nombre,
    puntos: operacion(jugador.puntos()),
  }));
}

// Copia del jugador, con sus arrays copiados también para que sea independiente
function copiarJugador(jugador) {
  return {
    ...jugador,
    partidas: [...jugador.partidas],
    bonificaciones: [...jugador.bonificaciones],
  };
}

// Une varios arrays de jugadores en uno nuevo
function unirCampeonatos(...listas) {
  let unidos = [];
  listas.forEach((lista) => {
    unidos = [...unidos, ...lista];
  });
  return unidos;
}

// ----- Jugadores del campeonato -----

const ana = crearJugador("Ana");
["victoria", "victoria", "empate", "derrota", "victoria"].forEach((r) => ana.registrarPartida(r));
ana.aplicarBonificaciones(2);

const brais = crearJugador("Brais");
["empate", "empate", "derrota", "victoria"].forEach((r) => brais.registrarPartida(r));

const carla = crearJugador("Carla");
["victoria", "victoria", "victoria", "empate"].forEach((r) => carla.registrarPartida(r));

const diego = crearJugador("Diego");
["victoria", "victoria", "empate", "empate", "empate", "empate"].forEach((r) =>
  diego.registrarPartida(r)
);

const eva = crearJugador("Eva");
["derrota", "derrota", "empate"].forEach((r) => eva.registrarPartida(r));
eva.aplicarBonificaciones(1, 1);

const fran = crearJugador("Fran");
["victoria", "empate", "derrota"].forEach((r) => fran.registrarPartida(r));
fran.aplicarBonificaciones(3);

const jugadores = [ana, brais, carla, diego, eva, fran];

// ----- Pruebas -----

console.log("\n1) Resumen de cada jugador");
jugadores.forEach((jugador) => console.log("  " + jugador.resumen()));

console.log("\n2) Un resultado que no existe");
console.log("  registrarPartida('ganada') ->", ana.registrarPartida("ganada"));
console.log("  partidas de Ana (siguen siendo 5):", ana.partidas.length);

console.log("\n3) Bonificaciones y búsqueda de jugadores");
const prueba = crearJugador("Prueba", "1.º DAW");
console.log("  aplicarBonificaciones(2, 1, 3) ->", prueba.aplicarBonificaciones(2, 1, 3));
console.log("  sin bonificaciones ->", prueba.aplicarBonificaciones());
console.log("  buscarJugador('Eva') ->", buscarJugador(jugadores, "Eva").nombre);
console.log("  buscarJugador('Zoe') ->", buscarJugador(jugadores, "Zoe"));

console.log("\n4) Clasificación (Carla y Diego empatan a 10 y va primero Carla por victorias)");
mostrarClasificacion(jugadores);
console.log("  el array original no cambia de orden:", jugadores.map((j) => j.nombre).join(", "));

console.log("\n5) Empate a puntos y a victorias: se ordenan alfabéticamente");
const adela = crearJugador("Adela");
["derrota", "derrota", "empate"].forEach((r) => adela.registrarPartida(r));
adela.aplicarBonificaciones(1, 1);
mostrarClasificacion(unirCampeonatos(jugadores, [adela]));

console.log("\n6) Jugadores por categoría y estadísticas");
console.log(jugadoresPorCategoria(jugadores));
console.log(estadisticas(jugadores));
console.log("  con la lista vacía:", jugadoresPorCategoria([]), estadisticas([]));

console.log("\n7) Invictos");
console.log("  invictos:", invictos(jugadores));
console.log("  un jugador sin partidas no cuenta:", invictos([crearJugador("Nuevo")]));

console.log("\n8) Operaciones especiales sobre todo el campeonato");
console.log("  duplicar:", aplicarOperacion(jugadores, duplicarPuntos));
console.log("  más 1 punto:", aplicarOperacion(jugadores, (p) => anadirPuntosExtra(p)));
console.log("  penalización de 4:", aplicarOperacion(jugadores, (p) => aplicarPenalizacion(p, 4)));
console.log("  los puntos de Ana no han cambiado:", ana.puntos());

console.log("\n9) Una copia no afecta al original");
const copia = copiarJugador(ana);
copia.registrarPartida("victoria");
copia.aplicarBonificaciones(5);
console.log("  original -> partidas:", ana.partidas.length, "puntos:", ana.puntos());
console.log("  copia    -> partidas:", copia.partidas.length, "puntos:", copia.puntos());

console.log("\n10) unirCampeonatos");
const grupoA = [ana, brais];
const grupoB = [carla, diego];
const grupoC = [eva, fran];
const todos = unirCampeonatos(grupoA, grupoB, grupoC);
console.log("  jugadores unidos:", todos.map((j) => j.nombre).join(", "));
console.log("  los arrays originales siguen igual:", grupoA.length, grupoB.length, grupoC.length);
