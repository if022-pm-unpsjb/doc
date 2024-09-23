
// Configuración inicial de los procesos con relojes vectoriales
let vc_process = [
  { id: "P1", x: 100, y: 100, clock: [0, 0, 0], events: [] },
  { id: "P2", x: 100, y: 200, clock: [0, 0, 0], events: [] },
  { id: "P3", x: 100, y: 300, clock: [0, 0, 0], events: [] },
];

// Parámetros de tiempo y espacio
const eventSpacing = 50;
const timelineWidth = 600;

// Crear el SVG y las líneas de tiempo para cada proceso
let vc_svg = d3.select("#vc-svg");

// Dibujar las líneas de tiempo
vc_process.forEach((process, index) => {
  // Línea de tiempo para cada proceso
  vc_svg.append("line")
    .attr("x1", process.x)
    .attr("y1", process.y)
    .attr("x2", process.x + timelineWidth)
    .attr("y2", process.y)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);
});

// Función para agregar un evento a la línea de tiempo de un proceso
function addEvent(process, type, receiverEventX) {
  let lastEventX = process.events.length > 0 ? process.events[process.events.length - 1].x : process.x;
  let eventX = lastEventX + eventSpacing 

  if (receiverEventX)
    eventX = receiverEventX
  
  // Agregamos el evento a la línea de tiempo
  vc_svg.append("circle")
    .attr("cx", eventX)
    .attr("cy", process.y)
    .attr("r", 10)
    .attr("fill", type === "local" ? "lightblue" : "lightgreen");

  // Añadir el evento al historial del proceso
  process.events.push({ x: eventX, type });
}

// Función para enviar un mensaje y actualizar los relojes vectoriales
function sendMessageVc(senderId, receiverId) {
  if (senderId === receiverId) {
    alert("El emisor y el receptor no pueden ser el mismo proceso.");
    return;
  }

  let senderProcess = vc_process.find(p => p.id === senderId);
  let receiverProcess = vc_process.find(p => p.id === receiverId);

  // Incrementa el reloj del proceso emisor
  senderProcess.clock[vc_process.indexOf(senderProcess)]++;

  // Añadir el evento local en el emisor
  addEvent(senderProcess, "local");

  // Obtener la posición del último evento del emisor
  let senderEvent = senderProcess.events[senderProcess.events.length - 1];

  // Sincronización de relojes al recibir el mensaje
  for (let i = 0; i < receiverProcess.clock.length; i++) {
    receiverProcess.clock[i] = Math.max(receiverProcess.clock[i], senderProcess.clock[i]);
  }
  receiverProcess.clock[vc_process.indexOf(receiverProcess)]++;

  // Obtener la posición actual del receptor
  let lastReceiverEventX = receiverProcess.events.length > 0
    ? receiverProcess.events[receiverProcess.events.length - 1].x
    : receiverProcess.x;

  // Asegurarse de que el evento del receptor esté más adelante en el tiempo
  let receiverEventX = Math.max(lastReceiverEventX + eventSpacing, senderEvent.x + eventSpacing);
  addEvent(receiverProcess, "message", receiverEventX);

  // Dibujar la línea del mensaje entre emisor y receptor
  vc_svg.append("line")
    .attr("x1", senderEvent.x)
    .attr("y1", senderProcess.y)
    .attr("x2", senderEvent.x)
    .attr("y2", senderProcess.y)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .attr("x2", receiverEventX)
    .attr("y2", receiverProcess.y);

  // Actualizar la visualización del reloj vectorial
  updateVcClocks();
}

// Función para actualizar las etiquetas de los relojes vectoriales
function updateVcClocks() {
  //vc_svg.selectAll("text.clock").remove();  // Borrar relojes previos
  
  vc_process.forEach(process => {
    let eventX = process.events.length > 0
      ? process.events[process.events.length - 1].x
      : process.x;

    vc_svg.append("text")
      .attr("x", eventX + 15)
      .attr("y", process.y - 20)
      .text(`[${process.clock.join(", ")}]`)
      .attr("font-size", "12px")
      .attr("class", "clock");
  });
}

// Evento para enviar mensajes
document.getElementById('sendMessageBtn').addEventListener('click', () => {
  let senderId = document.getElementById('sender').value;
  let receiverId = document.getElementById('receiver').value;
  sendMessageVc(senderId, receiverId);
});
