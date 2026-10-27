"use strict";

const pedidos = [
  { cliente: "Ana", importe: 15, metodoPago: "VISA" },
  { cliente: "Brais", importe: 42, metodoPago: "PAYPAL" },
  { cliente: "Carla", importe: 75, metodoPago: "VISA" },
  { cliente: "Diego", importe: 0, metodoPago: "EFECTIVO" },
  { cliente: "Eva", importe: 120, metodoPago: "PAYPAL" }
];

let totalPedidosValidos = 0;
let importeTotal = 0;

for (const pedido of pedidos) {
  // Ejercicio 3
  if (pedido.importe <= 0) {
    console.log(`Pedido de ${pedido.cliente} ignorado: importe no válido`);
    continue;
  }

  // Ejercicio 1
  let categoria;
  if (pedido.importe < 20) {
    categoria = "Pedido pequeño";
  } else if (pedido.importe <= 50) {
    categoria = "Pedido medio";
  } else {
    categoria = " ºPedido grande";
  }
  console.log(`${pedido.cliente} - ${pedido.importe} EUR - ${categoria}`);

  // Ejercicio 2
  switch (pedido.metodoPago) {
    case "VISA":
      console.log("Pago con tarjeta");
      break;
    case "PAYPAL":
      console.log("Pago con PayPal");
      break;
    case "EFECTIVO":
      console.log("Pago en efectivo");
      break;
    default:
      console.log("Método de pago desconocido");
  }

  // Ejercicio 4
  totalPedidosValidos++;
  importeTotal += pedido.importe;
}

// Ejercicio 4
console.log(`Pedidos válidos: ${totalPedidosValidos}`);
console.log(`Importe total: ${importeTotal} EUR`);

// Ejercicio 5
for (const pedido of pedidos) {
  if (pedido.importe > 100) {
    console.log(`Primer pedido superior a 100 EUR: ${pedido.cliente}`);
    break;
  }
}

// Ejercicio 7
let pedidoMayor = pedidos[0];
for (const pedido of pedidos) {
  if (pedido.importe > pedidoMayor.importe) {
    pedidoMayor = pedido;
  }
}

// Ejercicio 6
let opcion;
do {
  opcion = prompt(
    "MENÚ DE PEDIDOS\n" +
    "1. Ver número de pedidos válidos\n" +  
    "2. Ver importe total\n" +
    "3. Salir\n" +
    "4. Ver cliente con el pedido de mayor importe"
  );

  switch (opcion) {
    case "1":
      console.log(`Pedidos válidos: ${totalPedidosValidos}`);
      break;
    case "2":
      console.log(`Importe total: ${importeTotal} EUR`);
      break;
    case "3":
      console.log("Saliendo del menú...");
      break;
    case "4":
      console.log(`Pedido de mayor importe: ${pedidoMayor.cliente} - ${pedidoMayor.importe} EUR`);
      break;
    default:
      console.log("Opción no válida. Elige una opción del menú.");
  }
} while (opcion !== "3");
