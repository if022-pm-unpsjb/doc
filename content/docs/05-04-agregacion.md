+++
title = 'Coordinación epidémica'
draft = false
weight = 540
+++

# Coordinación basada en algoritmos epidémicos

Se puede utilizar gossip para recolectar información.

## Ejemplos de coordinación

Consensuar un mismo valor:

- Cada nodo $P_i$ escoge un valor arbitrario $v_i$
- Cuando dos nodos $P_i$ y $P_j$ intercambian datos: $v_i, v_j \leftarrow (v_i + v_j)/2$
- Eventualmente todos los nodos tendran el mismo valor (media de los valores iniciales)

Estimar el número de nodos:

- El nodo $P_1$ escoge $v_1=1$, el resto de los nodos $v_i=0$
- Si hay $N$ nodos, eventualmente todos tendran $v_i=1/N$
- Se puede estimar el tamaño de la red como $1/v_i$

Seleccionar un nodo al azar:

- Cada nodo $P_i$ seleccionar un valor $m_i$ al azar y setea $v_i=m_i$
- Al intercambiar datos $P_i$ y $P_j$ realizan $v_i, v_j \leftarrow max\{v_i, v_j\}$
- Si luego $m_i < v_i$, entonces el nodo $P_i$ _pierde_ la competencia.
- Eventualmente un único nodo será el ganador.

## Eventuales aplicaciones

- Un nodo al azar inicia el proceso de estimación de números de nodos.
- Si el numero de nodos es estable, se puede designar un nodo fijo para que realice el conteo.
- Caso contrario, se pueden utilizar _epocas_ o bien un nodo al azar cada tanto realiza un conteo.

## Peer-sampling

¿Cómo elegir un nodo al azar cuando no se conoce la totalidad de los nodos en el sistema?

Un nodo podría tener toda la información, pero no es una solución escalable.

Una solución es el uso de _vistas parciales_:

- Cada nodo mantiene una lista de _c_ nodos vecinos.
- Los nodos intercambian parte de sus listas parciales con otros nodos (en su vista parcial).
- Cada nodo actualiza su vista parcial, pero siempre manteniendo _c_ nodos en la misma.

Si esto se repite regularmente, escoger un nodo al azar de la vista parcial es **estadisticamente indistinguible** de hacerlo de la totalidad de los nodos.

## Construccion de redes superpuestas

Es posible utilizar las _vistas parciales_ para generar _topologías estructuradas_.

Un posible protocolo para lograrlo estaría dividido en dos capas:

- Una capa inferior que mantiene la _vista parcial_ y opera sobre la red no-estructurada.
- Una capa superior que genera una topología estructurada en base a la _vista parcial_.

## Rumores seguros

La velocidad de propagación de datos puede generar problemas de seguridad/confiabilidad.

Por ejemplo, $c$ nodos pueden cooperar maliciosamente para cooptar la red:

- Al intercambiar las vistas parciales, estos nodos envian $c/2$ entradas que sólo referencian a alguno de estos $c$ nodos.
- Gradualmente, las vistas parciales de _todos_ los nodos solo contienen referencias a un conjunto de estos $c$ nodos.

Se busca tratar de detectar y prevenir comportamiento malicioso

Los nodos maliciosos pueden ser detectados por el elevado número de referencias desde otros nodos (_indegree_)

Sin embargo, al detectarlos ya puede ser demasiado tarde

Una manera de mitigar es requerir que los nodos generen estadísticas:

- Al intercambiar vistas parciales se puede realizar también estadísticas
- Es importante que no se sepa cuando se utilizan para actualizar la vista parcial o para generar estadísticas
- Un nodo malicioso no puede devolver siempre enlaces a otros nodos maliciosos, sería rápidamente descubierto
- No queda otra que, de vez en cuando, "jugar con las reglas" de los nodos benignos





