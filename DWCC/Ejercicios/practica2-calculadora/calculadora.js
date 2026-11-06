// =====================================================
// PRÁCTICA 2 - CALCULADORA DE NOTAS
// MP0612 - Desarrollo web en entorno cliente
// Nota final = examen * 0,7 + práctica * 0,3
// =====================================================

// ---------- CONSTANTES ----------
const PESO_EXAMEN = 0.7;
const PESO_PRACTICA = 0.3;
const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 10;
const APROBADO = 5;
const DECIMALES = 2;
const CLAVE_HISTORIAL = 'historialNotas';
const MAX_HISTORIAL = 8;

// ---------- ELEMENTOS DE LA PÁGINA ----------
const formulario = document.getElementById('formulario');
const examen = document.getElementById('examen');
const practica = document.getElementById('practica');
const resultado = document.getElementById('resultado');
const notaMinima = document.getElementById('nota-minima');
const listaHistorial = document.getElementById('lista-historial');
const historialVacio = document.getElementById('historial-vacio');
const botonBorrar = document.getElementById('borrar-historial');

// ---------- CÁLCULO ----------

// Redondea a 2 decimales. Es importante hacerlo ANTES de decidir si está
// aprobado: con examen 4,57 y práctica 6 la nota exacta es 4,999, que se
// muestra como "5,00". Si comparásemos la nota exacta, la página enseñaría
// "5,00 - Suspenso", que es contradictorio para quien lo lee.
function redondear(numero) {
  const factor = 10 ** DECIMALES;
  return Math.round(numero * factor) / factor;
}

function calcularNotaFinal(notaExamen, notaPractica) {
  return redondear(notaExamen * PESO_EXAMEN + notaPractica * PESO_PRACTICA);
}

// Calificación en texto según la nota final
function obtenerCalificacion(nota) {
  if (nota < 5) return 'Insuficiente';
  if (nota < 6) return 'Suficiente';
  if (nota < 7) return 'Bien';
  if (nota < 9) return 'Notable';
  return 'Sobresaliente';
}

// Nota que hace falta en el examen para llegar al 5, dada la nota de práctica
function calcularNotaMinimaExamen(notaPractica) {
  return redondear((APROBADO - notaPractica * PESO_PRACTICA) / PESO_EXAMEN);
}

// ---------- VALIDACIÓN (punto A: sin alert) ----------
function validarCampo(campo, idError) {
  const error = document.getElementById(idError);
  const texto = campo.value.trim();
  const numero = Number(texto);

  let mensaje = '';

  if (texto === '') {
    mensaje = 'Escribe una nota.';
  } else if (Number.isNaN(numero)) {
    mensaje = 'Escribe un número válido.';
  } else if (numero < NOTA_MINIMA || numero > NOTA_MAXIMA) {
    mensaje = `La nota debe estar entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`;
  }

  error.textContent = mensaje;
  campo.classList.toggle('invalido', mensaje !== '');
  return mensaje === '';
}

// ---------- MOSTRAR EL RESULTADO ----------
// guardar = true solo cuando se pulsa «Calcular», para que el cálculo en vivo
// (punto B) no llene el historial con los valores intermedios que se teclean.
function calcular(guardar = false) {
  const examenValido = validarCampo(examen, 'error-examen');
  const practicaValida = validarCampo(practica, 'error-practica');

  if (!examenValido || !practicaValida) {
    resultado.textContent = '';
    resultado.className = '';
    notaMinima.textContent = '';
    return;
  }

  const notaExamen = Number(examen.value);
  const notaPractica = Number(practica.value);
  const notaFinal = calcularNotaFinal(notaExamen, notaPractica);
  const estaAprobado = notaFinal >= APROBADO;

  resultado.className = estaAprobado ? 'aprobado' : 'suspenso';
  resultado.textContent =
    `Nota final: ${notaFinal.toFixed(DECIMALES)} - ` +
    `${estaAprobado ? 'Aprobado' : 'Suspenso'} (${obtenerCalificacion(notaFinal)})`;

  // Punto C: nota mínima necesaria en el examen
  const necesaria = calcularNotaMinimaExamen(notaPractica);
  if (necesaria <= NOTA_MINIMA) {
    notaMinima.textContent = 'Solo con la nota de la práctica ya tienes el aprobado.';
  } else if (necesaria > NOTA_MAXIMA) {
    notaMinima.textContent =
      `Harían falta ${necesaria.toFixed(DECIMALES)} en el examen: con esta práctica no se puede llegar al 5.`;
  } else {
    notaMinima.textContent =
      `Necesitas un ${necesaria.toFixed(DECIMALES)} como mínimo en el examen para aprobar.`;
  }

  if (guardar) {
    guardarCalculo(notaExamen, notaPractica, notaFinal);
  }
}

// ---------- HISTORIAL EN localStorage (punto D) ----------
function leerHistorial() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL));
    return Array.isArray(guardado) ? guardado : [];
  } catch (error) {
    // Si lo guardado está corrupto o localStorage no está disponible
    return [];
  }
}

function mostrarHistorial() {
  const historial = leerHistorial();

  listaHistorial.innerHTML = '';
  historialVacio.hidden = historial.length > 0;

  historial.forEach((dato) => {
    const elemento = document.createElement('li');
    const estado = dato.nota >= APROBADO ? 'Aprobado' : 'Suspenso';
    elemento.textContent =
      `Examen ${dato.examen} / práctica ${dato.practica} -> ` +
      `${dato.nota.toFixed(DECIMALES)} (${estado})`;
    listaHistorial.appendChild(elemento);
  });
}

function guardarCalculo(notaExamen, notaPractica, notaFinal) {
  const historial = leerHistorial();

  // El más reciente primero, y nos quedamos solo con los últimos MAX_HISTORIAL
  historial.unshift({ examen: notaExamen, practica: notaPractica, nota: notaFinal });

  try {
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial.slice(0, MAX_HISTORIAL)));
  } catch (error) {
    console.warn('No se pudo guardar el historial:', error);
  }

  mostrarHistorial();
}

// ---------- EVENTOS ----------
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); // la página no se recarga
  calcular(true);          // al pulsar «Calcular» sí se guarda en el historial
});

// Punto B: resultado en vivo mientras se escribe (sin guardar)
examen.addEventListener('input', () => calcular());
practica.addEventListener('input', () => calcular());

botonBorrar.addEventListener('click', () => {
  localStorage.removeItem(CLAVE_HISTORIAL);
  mostrarHistorial();
});

// Al cargar la página se pinta el historial que hubiese guardado
mostrarHistorial();
