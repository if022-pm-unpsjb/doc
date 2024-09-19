+++
title = 'Algoritmos de elección'
date = 2024-09-18T23:05:01-03:00
draft = false
weight = 530
+++

# Algoritmos de elección

- Muchos algoritmos distribuidos requieren que un nodo actue como coordinador.
- No importa en general cual nodo en particular sea el coordinador... pero alguien tiene que hacerlo.
- Mediante un algoritmo de elección se escoje un nodo para que actue como coordinador.

- En general se asume:
    - Cada proceso *P* cuenta con un identificador único *id(P)*.
    - Cada proceso conoce a todo el conjunto de procesos (aunque no cuales estan funcionando).

- El objetivo de estos algoritmos es que cuando finalice la elección *todos* los procesos hayan acordado el mismo lider.

## Algoritmo del matón (*bully*)

- Considerar *N* procesos, cada uno con un identificador *k*, con *k* entre 0 y n-1.
- Cuando un proceso *k* se da cuenta que el lider no responde:
    - Envía un mensaje ELECTION a todos los nodos con identificador > k.
    - Si ninguno responde, el nodo *k* asume el papel de líder.
    - Si alguno responde con OK, toma el control del proceso de elección y *k* desiste.
    - Eventualmente, sólo un proceso tomará el control, enviando el mensaje COORDINATOR.
- Si un proceso caído retoma su ejecución, inicia una elección.
- Como el proceso con mayor ID es el que gana, se lo conoce por el nombre de "bully algorithm".

## Elección en un anillo

- Suponer que cada nodo conoce su sucesor, y al siguiente a este, y al proximo, y así.

- Cuando un nodo detecta que el coordinador no responde:
    - Envía un mensaje ELECTION a su sucesor (o al siguiente si este no responde), con su ID.
    - El receptor reenvia el mensaje ELECTION, agregando su propio ID.
    - Eventualmente, el mensaje retorna al emisor original.
    - En ese momento, el mensaje circula nuevamente ahora con el tipo COORDINATOR.
    - El mensaje contiene ahora: el nuevo coordinador (el ID mas alto) y que nodos estan activos en el anillo.

- ¿Importa que dos o más procesos inicien una elección?
    - No, únicamente habrá mayor recarga en la red.

## Elecciones en sistemas de gran escala

Muchos algoritmos de elección suponen un número pequeño de nodos.

Las cosas se vuelven complicadas a medida que el número de nodos aumenta.

Un ejemplo es una red _blockchain_.

### Proof of work

Consiste en que los nodos compitan en base a su **poder de cómputo**

Para esto, compiten para ver quien es el primero en resolver un problema complejo pero soluble.

El ganador es el nodo que primero difunde una solución.

El nodo ganador se convierte en el líder: es quien añade la transacción a la cadena de bloques.

Multiples problemas: 

- Principalmente, consumo de energía.
- ¿Cómo regular la complejidad del problema?

### Proof of stake

## Elecciones en redes inalambricas

En una red inalambrica, la transmisión no es necesariamente confiable, ni la topología permanece estática.

El algoritmo presentado por Vasudevan escoge el _mejor_ líder.

Para elegir un líder un nodo difunde un mensaje _ELECTION_ a sus vecinos.

Si un nodo vecino hubiera recibido ya un mensaje _ELECTION_, simplemente retorna un _ACK_.

Caso contrario, si recibe un mensaje _ELECTION_ por primera vez recuerda al nodo emisor y retrasmite el mensaje.

En cuanto todos los nodos vecinos responda a esta retransmisión de _ELECTION_, el nodo responde al emisor original.

