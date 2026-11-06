# Práctica 2: Calculadora de notas

**Hugo Ramos López** · MP0612 Desarrollo Web en Entorno Cliente · UD1

Página que calcula la nota final de un módulo con la fórmula
**nota final = examen × 0,7 + práctica × 0,3**.
Las dos notas van de 0 a 10 y se aprueba con un 5.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura semántica (`header`, `main`, `footer`) y el formulario |
| `estilos.css` | Tarjeta centrada, diseño adaptable a móvil y colores del resultado |
| `calculadora.js` | Validación, cálculo, nota mínima e historial |

## Mínimos

1. **HTML** — formulario con dos campos numéricos, cada uno con su `<label>`, botón «Calcular» y zona de resultado. Etiquetas semánticas y el script enlazado con `defer`, para que encuentre los elementos de la página.
2. **CSS** — la calculadora se muestra centrada en una tarjeta y se adapta al móvil. El resultado sale **en verde** si es aprobado y **en rojo** si es suspenso.
3. **JavaScript** — al pulsar «Calcular» se leen las dos notas, se calcula la nota final, se muestra con dos decimales y se indica «Aprobado» o «Suspenso». El `submit` usa `preventDefault()`, así que la página no se recarga.

## Puntos a mayores

- **A · Validación** — si un campo está vacío, no es un número o está fuera de 0–10, no se calcula: aparece un aviso debajo del campo (sin `alert()`) y el campo se marca en rojo.
- **B · En vivo** — el resultado se actualiza con el evento `input`, mientras se escribe, sin pulsar el botón.
- **C · Nota mínima** — se indica qué nota hace falta como mínimo en el examen para aprobar, a partir de la nota de la práctica: `(5 − práctica × 0,3) / 0,7`. Se avisa aparte de los dos casos extremos: cuando la práctica sola ya da el aprobado y cuando ni un 10 en el examen llega al 5.
- **D · Historial** — los últimos 8 cálculos se guardan en `localStorage`, se muestran en una lista que se conserva al recargar y hay un botón para borrarla.
- **E · Calificación** — Insuficiente (< 5), Suficiente (5 a < 6), Bien (6 a < 7), Notable (7 a < 9) y Sobresaliente (9 o más).
- **F · Publicación** — pendiente de activar GitHub Pages (ver abajo).

## Dos decisiones que conviene explicar

**Redondear antes de decidir si está aprobado.** Con examen 4,57 y práctica 6 la nota exacta es
`4,57 × 0,7 + 6 × 0,3 = 4,999`. Si se compara la nota exacta con el 5, la página muestra
«Nota final: 5,00 — Suspenso», que es una contradicción para quien la lee. Por eso se redondea
primero a dos decimales y después se decide el aprobado, de forma que lo que se ve y el
veredicto siempre coinciden.

**El cálculo en vivo no guarda en el historial.** Si se guardase en cada pulsación, al teclear
«7,5» se almacenarían también el 7 y los valores intermedios. El historial solo se escribe al
pulsar «Calcular»; mientras se escribe, el resultado se actualiza pero no se guarda.

## Cómo probarla

```bash
cd practica2-calculadora
python3 -m http.server 8080
```

Y abrir <http://localhost:8080>. Conviene usar un servidor en lugar de abrir el archivo
directamente, porque algunos navegadores limitan `localStorage` en páginas `file://`.

Casos de prueba: un campo vacío, un 11, un −1, texto, examen 4,57 con práctica 6, y recargar
la página para comprobar que el historial sigue ahí.

## Publicación (punto F)

En *Settings → Pages*, elegir *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
Enlace, una vez activado:

<!-- https://hugoramos-tech.github.io/DWCC-HugoRamosLopez/DWCC/Ejercicios/practica2-calculadora/ -->

_(pendiente: añadir el enlace aquí cuando Pages esté activo)_
