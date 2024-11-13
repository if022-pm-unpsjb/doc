+++
title = 'Resiliencia de procesos'
date = 2024-11-12
draft = false
weight = 820 
type = 'docs'
+++

# Resiliencia de procesos

La falla de un proceso se enmascara replicando el mismo como un grupo de procesos.

## Grupos de procesos

El cliente debe ver al grupo de procesos como una única entidad.

Un mensaje enviado al grupo debe ser enviado a cada uno de sus procesos.

Los grupos pueden ser dinámicos:
- Pueden ser creados, modificados, eliminados.
- Un proceso puede unirse a un grupo o abandonarlo.
- Un proceso puede ser parte de más de un grupo.

### Organización

Grupo planos: 
- Simétrico: todos los procesos son idénticos. 
- No existe un único punto de falla.
- Es más complicado llegar a un consenso.
- Ej: p2p.

Grupo jerárquico: 
- Asimétrico: por ejemplo, un coordinador y múltiples procesos subordinados.
- El coordinador facilita la toma de desiciones.
- El coordinador es también un punto de falla.

### Administración de la membresía

¿Cómo administrar la creación y eliminación de grupos? ¿La entrada y salida de procesos?

Solución centralizada:
- Utilizar un servidor de grupos.
- Se encarga de llevar registros de los grupos y sus procesos.
- El servidor es un único punto de falla.

Solución distribuida:
- Cada nodo mantiene información de sus vecinos / grupo entero.
- Por ejemplo, se puede anunciar el ingreso mediante un multicast.

Problema: ¿Cómo detectar que un proceso no es parte del grupo ante una falla?
- Hay que diferenciarlo de un proceso lento / congestion de red.

La entrada y salida de un proceso debe ser _sincrónica_:
- Al ingresar, debe recibir todos los mensajes generados o enviados al grupo.
- Al abandonarlo, no debe recibir ningún mensaje dirigido o generado por el grupo.

## Enmascaramiento de fallas

¿Cuanta replicación es necesaria?

Suponer que se intenta tolerar hasta $k$ procesos defectuosos.

Un grupo es $k$-tolerante si cumple con sus requerimentos aún ante la falla de $k$ elementos.

¿Cuantos procesos son necesarios para ser $k$-tolerante?

En un modelo de fallas _fail-silent_: $k+1$
- En el peor caso, el único nodo funcional responde.

Ante fallas _arbitrarias_: $2k+1$
- Por mayoría simple se puede elegir la respuesta correcta.

## Consenso

Suponer un modelo de _crash failures_

### Inundación

Suponer un modelo de fallas de detención (_fail-stop_)

En cada ronda cada proceso envía su lista de comandos a todo el resto.

Como todos ordenan los comandos de la misma forma, se llega a un consenso.

Un proceso sólo avanza a la siguiente ronda si recibe un mensaje de _todos_ los _procesos no defectuosos_ en el grupo.

Puede avanzar de ronda sin tomar una desición (ejecutar un comando).

### Raft

Algoritmo de consenso basado en primario

Supone un modelo de falla de detención *fail-noisy*

Eventualmente se detecta un proceso defectuoso).

Características:
- Servidores replicados basado en primario (+5)
- Cada servidor mantiene un log de operaciones.
- Una operación puede estar ejecutada o pendiente.
- El líder decide el orden de las operaciones ejecutadas.

Ver: https://thesecretlivesofdata.com/raft/

### Paxos

Consultar filmina

## Consenso con fallas arbitrarias

Suponer ahora un modelo de fallas arbitrarias.

En ese caso, se necesitan $3k+1$ procesos para ser $k$-tolerante.

Ejemplo: Practical Byzantine Fault Tolerance

## Limitaciones

### FLP

Llegar a un consenso no es posible en sistemas asincrónicos si falla *al menos* un nodo.

### CAP

Consistency - Availability - Partitioning tolerant

Sólo se puede tener dos de estas propiedades: CP o AP.

En la práctica se deben definir compromisos (trade-offs)

Las particiones pueden ser resueltas mediante balanceadores de carga en sistemas web.

Sin embargo, en sistemas móviles es más notoria el compromiso ante particiones.

### PACELC

Si hay particiones, se debe resolver el compromiso entre disponibilidad y consistencia.

Caso contrario, el compromiso es entre *latencia* y consistencia (favoreciendo la primera antes que la segunda).

### CALM

Algoritmos monótonos cumplen con consistencia, disponibilidad y tolerancia a las particiones.

Ejemplo: uso de CRDT (Conflict-free replicated data type, tipos de datos replicados sin conflicto)

## Detección de fallas

Preguntar periódicamente si un proceso esta funcionando.

En redes no confiables, al usar timeouts se pueden generar falsos positivos.
- Nodos que no responden a tiempo, pero que son funcionales pueden ser removidos del grupo.

Al detectar que un nodo no responde a un timeout, se puede consultar a otros nodos vecinos.

