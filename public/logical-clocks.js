
// Configuración inicial de los procesos y sus relojes
let processes = [
  { id: "P1", x: 100, y: 200, clock: 0 },
  { id: "P2", x: 300, y: 100, clock: 0 },
  { id: "P3", x: 500, y: 200, clock: 0 },
];

// Seleccionamos el SVG y agregamos círculos para los procesos
let svg = d3.select("#lc-svg");

let nodes = svg.selectAll("circle")
  .data(processes)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", 30)
  .attr("fill", "lightblue");

// Añadimos texto a los procesos (nombre del proceso y reloj)
let labels = svg.selectAll("text")
  .data(processes)
  .enter()
  .append("text")
  .attr("x", d => d.x)
  .attr("y", d => d.y - 40)
  .attr("text-anchor", "middle")
  .text(d => `${d.id}: ${d.clock}`);

// Función para actualizar los relojes en la visualización
function updateClocks() {
  labels.text(d => `${d.id}: ${d.clock}`);
}

// Función para enviar mensajes entre procesos
function sendMessage(sender, receiver) {
  let senderProcess = processes.find(p => p.id === sender);
  let receiverProcess = processes.find(p => p.id === receiver);

  // Incrementamos el reloj del proceso emisor
  senderProcess.clock++;
  
  // Simulamos la comunicación: animación de una línea
  svg.append("line")
    .attr("x1", senderProcess.x)
    .attr("y1", senderProcess.y)
    .attr("x2", senderProcess.x)
    .attr("y2", senderProcess.y)
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .attr("x2", receiverProcess.x)
    .attr("y2", receiverProcess.y)
    .on("end", function() {
      // Al terminar la animación, actualizamos el reloj del receptor
      receiverProcess.clock = Math.max(receiverProcess.clock, senderProcess.clock) + 1;
      updateClocks(); // Actualizamos la visualización
      d3.select(this).remove(); // Quitamos la línea después de la animación
    });
  
  updateClocks(); // Actualizamos la visualización del emisor
}

// Añadir los eventos de click a los botones para enviar mensajes
document.getElementById('send1to2').addEventListener('click', () => sendMessage('P1', 'P2'));
document.getElementById('send2to3').addEventListener('click', () => sendMessage('P2', 'P3'));
document.getElementById('send3to1').addEventListener('click', () => sendMessage('P3', 'P1'));
