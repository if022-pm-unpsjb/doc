+++
title = 'Comunicación confiable'
date = 2024-11-05
draft = false
weight = 830 
type = 'docs'
+++

# Comunicación confiable

Los enlaces de comunicación *también* fallan.

Los canales de comunicación pueden experimentar:

- Fallas de detención
- Fallas de omisión (ej: mensajes perdidos)
- Temporales (ej: imeouts)
- Fallas arbitrarias (ej: mensajes duplicados)

## Comunicación punto a punto

La comunicación punto a punto puede ser resuelta mediante TCP.

- Enmascara fallas de omisión
- No resuelve fallas de detención.

## Semántica de RPC en caso de fallos

Clases de falla en RPC:

- El cliente no puede ubicar el servidor.
    - No se puede ubicar el servidor.
    - El stub del cliente es incompatible con una nueva versión.
    - Posible solución: generar una excepción.
    
- La petición del cliente se pierde.
    - Se reenvía si no se recibe respuesta o confirmación.
    - Sencillo de implementar
    - ¿Cómo identificar que se perdió?
    
- El servidor falla luego de recibir la petición.
    - Dos casos:
        - Servidor falla *antes* de procesar la petición.
        - Servidor falla *luego* de procesar la petición.
    - Se deben tratar de manera separada.
    - *at-least-once*: seguir insistiendo hasta que se recibe una respuesta.
    - *at-most-once*: reportar el error inmediatamente.
    - *exactly-once*: [imposible](https://bravenewgeek.com/you-cannot-have-exactly-once-delivery/)
        - No se puede garantizar que el servidor *reciba* la petición exactamente una única vez.
        - Se puede "emular", ej: recepción at-least-once combinado con peticiones idempotentes o control de duplicados.
    - *no-warranties*: no garantizar ninguna de las anteriores.
    - **Moraleja**: la recuperación transparente de un servidor no es posible.

- Se pierde la respuesta a la petición.
    - Timeouts: no distingue entre mensajes perdidos y fallas temporales.
    - Peticiones idempotentes: se pueden reenviar sin efectos secundarios.
    - Números de secuencia: requiere mantener estado de los clientes.
    - Información de retransmisión: bit o bandera que indique que es una retransmisión.

- El cliente falla luego de enviar la petición.
    - Genera procesos "huerfanos" del lado del servidor.
        - Consumen recursos.
        - Pueden mantener recursos compartidos bloqueados.
        - Pueden responder consultas más recientes, generando confusión.
    - Soluciones:
        - Exterminio: requiere log persistente de las operaciones, para identificar los procesos huerfanos y aniquilarlos.
        - Reencarnación: similar, pero el cliente anuncia una nueva epoca (epoch), y se elimina a los huerfanos de épocas anteriores.
        - Expiración: los procesos generados por una RPC deben completar antes de un tiempo $T$. Pueden recibir tiempo adicional del cliente. Si el cliente falla, pasado un tiempo $T$ los procesos huerfanos finalizan.
        - No hacer nada: el cliente debe poder manejar respuestas de RPCs anteriores a su falla.

## Comunicación grupal confiable 

Servicios que permitan que los mensajes sean entregados a todos los procesos dentro de un grupo.

Distinción
- Recepción: el mensaje es entregado al _middleware_ 
- Entrega: el mensaje es entregado a la aplicación 

En casos de procesos que fallan, la comunicación es confiable cuando los mensajes son _recepcionados_ y luego _entregados_ a todos los _participantes no defectuosos_ de un grupo.

Parte dificil: acordar cuales son los participantes del grupo.

Implementación:

- Comunicación punto-a-punto:
    - Si el grupo es pequeño y los participantes conocidos.
    - Ejemplo: conexión TCP para envio de mensaje y ACK

- Comunicación multicast
    - En general no confiable (mensajes perdidos)
    - Uso de número de secuencia
    - ACK de cada recepción
        - O bien, incluido en otro mensaje (_piggyback_)
    - Permite solicitar reenvio de mensajes perdidos
        - El reenvio puede ser punto-a-punto

Principal problema: escalabilidad

- El emisor puede sufrir _feedback implosion_
    - Osea, ser ahogado por ACKs o peticiones de reenvio

- Alternativa: sólo reenviar NACKs.
    - Mejora la escalabilidad.
    - No garantiza la ausencia de _feedback implosion_
    - ¿Cuanto tiempo guardar un mensaje?

- Clave: reducir el número de mensajes de feedback.

- Scalable Reliable Multicasting (SRM)
    - No-jerarquico
    - Se reportan únicamente NACKs.
    - El NACKs se reporta mediante *multicast*
        - Se realiza luego de un tiempo aleatorio
        - Otro nodo que no haya recibido el mensaje puede así suprimir su NACK.
        - Pero interrumpe nodos que *sí* recibieron el mensaje.
        - Pueden asistir reenviando el mensaje.

- Jerárquico:
    - Árbol de difusión
    - Cada nodo es un grupo de procesos
        - Dentro del grupo se usa multicasting
        - Existe un coordinador.
    - Los coordinadores se comunican mediante enlaces punto-a-punto
    - La difusión de un mensaje en cada grupo llega al coordinador
    - El coordinador reenvía el mensaje a otros coordinadores.
    - Un ACK o NACK de un coordinador representa a todo un grupo.

Ambos tipos pueden ser combinados 

- ¿Rumores?
    - Es una buena opción
    - La difusión es más lenta, pero es escalable y robusta

## Multicast atómico

Garantizar que un mensaje sea entregado a todos los procesos no defectuoso o a ninguno.

Un mensaje $m$ es asociado a una lista de procesos a los cuales debe ser entregado.

Esta lista se conoce como *vista de grupo*.

Cada uno de los procesos en dicho grupo debe tener *la misma* vista de grupo.

- Osea, todos deben coincidir en cuales son los integrantes del grupo.

Cuando un proceso se suma o abandona la vista, se dice que ocurre un *cambio de vista*

- Generalmente anunciado también mediante un mensaje.

### Multicast virtualmente sincrónico

Si ante la falla del emisor del multicast de un mensaje $m$, el mismo es entregado a todos o a ninguno en el grupo, se dice que que el multicast es *virtualmente sincrónico*.

En otras palabras, un multicast no puede extenderse sobre dos *vistas de grupo*.

O dicho de otra manera, las *vistas de grupo* son efectivamente barreras entre los multicast.

### Orden de los mensajes

El orden de los mensajes en un multicast puede ser:

- Sin orden
- FIFO
- Causal
- Total

En FIFO se garantiza que los mensajes de un mismo emisor son recibidos en orden, pero cada proceso puede ver un intercalamiento diferente de mensajes de distintos emisores.

En causal se garantiza que todos los procesos vean mensajes *causalmente relacionados* en el mismo orden.

El *orden total* requiere que todos los procesos reciban los mensajes en el mismo orden (sin importar cual sea).

Finalmente, *multicast atómico* es un multicast *confiable, virtualmente sincrónico, totalmente ordenado*.

