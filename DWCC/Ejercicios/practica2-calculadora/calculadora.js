const formulario = document.getElementById('formulario');
const examen = document.getElementById('examen');
const practica = document.getElementById('practica');
const resultado = document.getElementById('resultado');
const notaMinima = document.getElementById('nota-minima');
const listaHistorial = document.getElementById('lista-historial');
const claveHistorial = 'historialNotas';

function validarCampo(campo, idError) {
  const error = document.getElementById(idError);
  const numero = Number(campo.value);

  if (campo.value === '') {
    error.textContent = 'Escribe una nota.';
    campo.classList.add('invalido');
    return false;
  }

  if (numero < 0 || numero > 10) {
    error.textContent = 'La nota debe estar entre 0 y 10.';
    campo.classList.add('invalido');
    return false;
  }

  error.textContent = '';
  campo.classList.remove('invalido');
  return true;
}

function calcular() {
  const examenCorrecto = validarCampo(examen, 'error-examen');
  const practicaCorrecta = validarCampo(practica, 'error-practica');

  if (!examenCorrecto || !practicaCorrecta) {
    resultado.textContent = '';
    notaMinima.textContent = '';
    return;
  }

  const notaExamen = Number(examen.value);
  const notaPractica = Number(practica.value);
  const notaFinal = notaExamen * 0.7 + notaPractica * 0.3;
  const aprobado = notaFinal >= 5;

  let calificacion;
  if (notaFinal < 5) calificacion = 'Insuficiente';
  else if (notaFinal < 6) calificacion = 'Suficiente';
  else if (notaFinal < 7) calificacion = 'Bien';
  else if (notaFinal < 9) calificacion = 'Notable';
  else calificacion = 'Sobresaliente';

  resultado.className = aprobado ? 'aprobado' : 'suspenso';
  resultado.textContent = `Nota final: ${notaFinal.toFixed(2)} - ${aprobado ? 'Aprobado' : 'Suspenso'} (${calificacion})`;

  const necesaria = (5 - notaPractica * 0.3) / 0.7;
  if (necesaria <= 0) {
    notaMinima.textContent = 'Con la nota de práctica ya tienes el aprobado.';
  } else if (necesaria > 10) {
    notaMinima.textContent = `Necesitarías un ${necesaria.toFixed(2)} en el examen; no es posible llegar al 5.`;
  } else {
    notaMinima.textContent = `Necesitas un ${necesaria.toFixed(2)} como mínimo en el examen para aprobar.`;
  }

  guardarCalculo(notaExamen, notaPractica, notaFinal);
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  calcular();
});

examen.addEventListener('input', calcular);
practica.addEventListener('input', calcular);

function mostrarHistorial() {
  let historial = [];
  try {
    historial = JSON.parse(localStorage.getItem(claveHistorial)) || [];
  } catch (error) {
    historial = [];
  }

  listaHistorial.innerHTML = '';
  historial.forEach(function (dato) {
    const elemento = document.createElement('li');
    elemento.textContent = `Examen ${dato.examen}, práctica ${dato.practica}: ${dato.nota.toFixed(2)} (${dato.nota >= 5 ? 'Aprobado' : 'Suspenso'})`;
    listaHistorial.appendChild(elemento);
  });
}

function guardarCalculo(notaExamen, notaPractica, notaFinal) {
  let historial = [];
  try {
    historial = JSON.parse(localStorage.getItem(claveHistorial)) || [];
  } catch (error) {
    historial = [];
  }

  const ultimo = historial[0];
  if (!ultimo || ultimo.examen !== notaExamen || ultimo.practica !== notaPractica) {
    historial.unshift({ examen: notaExamen, practica: notaPractica, nota: notaFinal });
    historial = historial.slice(0, 8);
    localStorage.setItem(claveHistorial, JSON.stringify(historial));
    mostrarHistorial();
  }
}

document.getElementById('borrar-historial').addEventListener('click', function () {
  localStorage.removeItem(claveHistorial);
  mostrarHistorial();
});

mostrarHistorial();
