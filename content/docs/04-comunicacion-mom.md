+++
title = 'MoM'
date = 2024-09-18T23:04:02-03:00
draft = false
weight = 420 
+++

# Middleware orientado a mensajes (MoM)

RPC o RMI no son adecuados en todas las situaciones, por ejemplo:

- el receptor puede no estar disponible al momento que el emisor envía el mensaje.
- la arquitectura del sistema es otra que cliente/servidor.

Alternativa: envío de mensajes.

## Uso de sockets

Socket: abstraccion sobre un puerto, donde se puede escribir o leer datos, usando un protocolo específico (ej: TCP o UDP).

No presenta el nivel de abstracción necesario. Cualquier funcionalidad adicional debe ser implementada por la aplicación. 

## Uso de patrones

La mayoría de las comunicaciones realizadas por las aplicaciones pueden ser categorizadas en unos pocos patrones:

Ej: request-reply, publish-subscribe, pipeline

Ej de implementación: ZeroMQ.

## MPI

Uso de paso de mensajes en computación de alto perfomance, por ejemplo clusters. TCP esta orientado a su uso sobre IP, por lo cual no es necesariamente efectivo en estas situaciones.

El estándar MPI se definio para lograr interoperabilidad entre soluciones de paso de mensajes para este tipo de escenarios.

Ej: no asume que un error en la red es recuperable.

Considera grupos de procesos, donde cada proceso tiene un identificador (grupoID, procesoID). Un proceso puede pertenecer a mas de un grupo.

Mas de 650 operaciones definidas.

## Comunicación persistente

Sistemas de manejos de colas: ofrecen soporte para la comunicación asincrónica persistente.

Idea básica: las aplicaciones se comunican enviando mensajes a buzones. Estos mensajes pueden a su vez ser reenviados a otros servidores de colas. En general cada aplicación tiene asociada una cola de mensajes.

Garantía: en general se da la garantía que el mensaje será puesto en la cola de mensajes del receptor, pero no que este lo leerá.

Emisor y receptor quedan así totalmente desacoplados en tiempo y espacio.

El contenido de los mensajes es arbitrario, aunque posiblemente limitado en tamaño. Solamente debe estar correctamente indicado el receptor.

Primitivas: PUT, GET, POLL, NOTIFY.

### Arquitectura de un MoM

En general las colas de mensajes son responsabilidad de un administrador de colas de mensajes (_queue manager_).

En general el administrador de colas de mensajes es un proceso separado del cliente y/o el emisor.

El administrador tiene la responsabilidad de "rutear" los mensajes correctamente.

En general las direcciones de las colas de mensajes deben proveer transparencia de ubicación.

Una cuestión a tener en cuenta es cómo informar a los distinos administradores de las direcciones existentes.

En sistemas complejos, no es realista que un administrador conozca a todo el resto: se debe rutear los mensajes con información incompleta (problema analogo a los routers en una red IP). Se utiliza una red superpuesta.

### Brokers

Un uso común de los sistemas de mensajes es integrar aplicaciones nuevas y existentes en un sistema coherente (¿suena?)

La integración requiere que las aplicaciones comprendan los mensajes que reciben del resto.

Esto requiere que cada aplicacion entienda la sintaxis y la semántica de los protocolos utilizados por el resto.

Soluciones?

- Cada aplicación convierte los mensajes: impráctico, en un sistema con N aplicaciones, se requieren N^2 convertidores.
- Protocolo común: no es realista, dada la heterogeneidad de las aplicaciones.
- Información de sintaxis en cada mensaje: ejemplo, con esquemas XML. Falta entender la _semántica_.

Entonces? No se puede esconder la situación, por lo tanto se debe ofrecer un mecanismo lo más simple posible para las conversiones.

Un broker es una aplicación en un sistema de mensajería que se encarga de la conversión de mensajes.

Mucho más que un convertidor, puede actuar también como un _gateway_ a nivel de aplicación:

- Manejo de publicación/subscripción.
- Prioridades.
- Multicasting.
- Logging.
- Balanceo de carga.
- Etc.

Para todo esto, un broker maneja una serie de reglas de transformación, ruteo, etc., que deben ser configuradas por un experto.
    
### Ejemplo: AMQP

Advanced Message-Queuing Protocol (AMQP).

AMQP ofrece:

- Un servicio de mensajería.
- Un protocolo de mensajes.
- Una interfaz de mensajería para las aplicaciones.

Comunicación:

- Una aplicación establece una conexión con el administrador de colas de mensajes.
- Una conexión incorpora múltiples canales de una sola vía.
- Conexión -> mayor tiempo de vida, estable
- Canal -> dinámica, tiempo de vida breve
- Sesión: agrupamiento lógico de dos canales para comunicación full-duplex

Manejo de mensajes:

- Tipos de nodos: productor, consumidor, cola
- Los mensajes pueden ser persistentes (los nodos intermedios deben poder recuperarlo luego de un error)
