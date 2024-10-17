+++
title = 'Protocolos de consistencia'
date = 2024-10-17T07:30:03-03:00
draft = false
weight = 750 
type = 'docs'
+++

# Protocolos de consistencia

Los modelos de consistencia se implementan siguiendo algún protocolo.

## Basados en un primario

Utilizados para implementar modelos de consistencia secuencial.

Cada item $x$ tiene asociado un **nodo (replica) primario** en el *data store*.

Este nodo es responsable de coordinar las operaciones de actualización.

Osea, **un unico nodo o replica** es responsable de realizar las actualizaciones
- Luego las propaga al resto de los nodos, claro.

El nodo primario puede estar 
- **fijo** (osea, ser remoto)
- **trasladarse** (se traslada a donde se realice la escritura)

### Primario remoto

A.K.A *primary-backup*, *escritura-remota*

Cuando una réplica recibe una operacion de escritura, la **reenvia** al nodo primario.

El nodo primario coordina cómo y cuando relizar la escritura, y lo comunica al resto de las replicas.

Cuando todas las réplicas realizaron la operación, un *ACK* es envíado al cliente.

Relativamente sencillo de implementar

Posibles problemas de performance por la espera (**bloqueante**)

Variante: informar el *ACK* cuando el primario recibe la operación, sin esperar la propagación (**no-bloqueante**)

Mediante este protocolo, es posible implementar modelos de **consistencia secuencial**

Además, la versión bloqueante permite leer siempre la última escritura.

### Primario local

A.K.A *escritura-local*

En este caso, el primario *migra* a donde sea requerida la operación de escritura.

Ventaja: permite realizar múltiples operaciones de escritura localmente.

Requiere una propagación de la actualización de manera **no-bloqueante**.

Útil es computación móvil: 
- el dispositivo puede volverse el *primario* de los datos que espera modificar mientras este desconectado.
- el resto de los nodos puede realizar operaciones de lectura (pero no escrituras)

### Primario local + Remoto

En un modelo de **primario remoto**, una replica puede actuar como **primario local** momentaneamente.

De esta manera múltiples operaciones de escritura tienen una mejor performance.

La replica luego informa al **primario remoto** las modificaciones para su propagación.

Ejemplo: sistemas de archivos distribuidos.

## Escrituras replicadas

En este tipo de protocolos, **múltiples replicas** pueden realizar operaciones de escritura.

Variantes: 
- Replicación activa (la operación se envía a **todos** las replicas)
- Quorum (basados en voto)

### Replicación activa

Cada replica tiene asociado un proceso que realiza actualizaciones.

En general se propaga la operación.

Para consistencia, requiere:
- **multicas totalmente ordenado**
- O bien, un secuenciador central que de un número secuencial a cada operación.

### Quorum

Las operaciones de lectura o escritura deben tener el permiso de la mayoría ($N/2 + 1$)

Dos tipos de quorum:
- De lectura ($Q_r$)
- De escritura ($Q_w$)

Suponer que existen $N$ resplicas, entonces:

- Si $Q_r + Q_w > N$ no existen conflictos lectura-escritura (*write/read*)

- Si $Q_w > N/2$ no existen conflictos de escritura-escritura (*write/write*)

Suponer 6 replicas. Entonces $Q_w \geq 4$ y $Q_r \geq 3$: 

- Cualquier quorum de lectura siempre detecta al menos una versión más reciente de un item.

- Cualquier quorum de escritura evita un conflicto *write/write*

**ROWA**: Read-once, Write-all

- Caso especial si $Q_r = 1$ entonces $Q_w = N$
- Mejora la performance de lectura, a costa de la de escritura.

## Coherencia de cache

Mantener la cache coherente con el estado de los servidores.

En el caso de sistemas distribuidos, la detección se realiza en tiempo de ejecución.

¿Cómo forzar la coherencia?

- Enviar invalidaciones cuando los datos son replicados.

- Propagar la actualización

- No permitir almacenar en cache datos compartidos entre clientes.

¿Qué sucede cuando se modifican datos en la cache?

- *write-through*: envíar actualización a las réplicas

- *write-back*: envíar **múltiples** actualizaicones a las réplicas

## Consistencia centrada en el cliente

Sencilla de implementar si se ignora la performance.

- Cada operacion de escritura $W$ tiene asignado un identificador global.

Cada cliente tiene asociado dos conjuntos de escrituras:

- *read-set*: escrituras relevantes a las operaciones de lectura.
- *write-set*: el conjunto de escrituras del cliente.

### Lecturas monotónicas

El cliente pasa a la réplica la operación de lectura y el conjunto *read-set*.

Si la replica no tiene las operaciones en el conjunto *read-set*:

- Pide las operaciones a otro servidor que sí las tenga.
- O bien, deriva la operación de lectura.

### Escrituras monotónicas

El cliente pasa a la réplica la operación de escritura y el conjunto *write-set*.

La réplica debe verificar que cuenta con todas las operaciones de escritura.

Caso contrario, o se actualiza o deriva la operación de escritura.

Cuando la operación de escritura se realiza con éxito, la misma es agregada en el *write-set*.

### Lee tus escrituras

La replica debe contener todas las operaciones del conjunto *write-set*

### Escrituras siguen lecturas

La replica debe contener todas las operaciones del conjunto *read-set*

Una vez realizada la escritura, esta se agrega tanto en *write-set* como en *read-set*


