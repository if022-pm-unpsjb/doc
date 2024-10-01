+++
title = 'Chord'
date = 2024-09-18T23:06:02-03:00
draft = false
weight = 630
+++

# Chord

[Chord](https://en.wikipedia.org/wiki/Chord_(peer-to-peer)) es un sistema [DHT](https://en.wikipedia.org/wiki/Distributed_hash_table) (Distributed Hash Table) relativamente sencillo de entender, utilizado en redes [p2p]({{< ref "02-arquitectura.md#arquitecturas-simétricas" >}})

Otros sistemas similares:
- [Pastry](https://en.wikipedia.org/wiki/Pastry_(DHT))
- [Tapestry](https://en.wikipedia.org/wiki/Tapestry_(DHT))

Algunos links interesantes:
- [Paper original](https://doi.org/10.1145%2F964723.383071)

## Simulador

Pueden probar como funciona Chord con este [simulador](/chordgen/chordgen.html)

## Descripción general

Usa un espacio de $m$ bits para asignar **identificadores** a nodos y **claves** a entidades.

El número $m$ de bits usualmente esta entre 128 y 160.

Una entidad con clave $k$ es administrada por el nodo con el menor identificador $p$ tal que $p \geq k$.

Dicho nodo se denomina **sucesor** de $k$ y se denota $succ(k)$

Los nodos se organizan en un **anillo**:
- Cada nodo mantiene referencias a su *sucesor* y *predecesor*

## Resolución de nombres

Problema: Dado un clave $k$ ¿Cómo resolver **eficientemente** la dirección de $succ(k)$?

### Solución lineal

Una solución simple es pasar la consulta al siguiente nodo en el anillo.

Cuando un nodo $p$ recibe una consulta por una entidad con clave $k$
- Responde la consulta si $pred(p) < k \leq p$
- Caso contrario, pasa la consulta a $succ(p+1)$

En promedio, una consulta requerirá recorrer **la mitad del anillo**.

### Solución exponencial

Cada nodo mantiene una tabla con $s \leq m$ entradas conocida como _tabla finger_

La tabla del nodo $p$ se denota $F_p$

Cada entrada $i$ contiene lo siguiente:

$$ F_p[i] = succ((p + 2^{i-1}) \quad mod \quad 2^m) $$

**Ejemplo:** con $m=5$ ($2^5=32$ identificadores) y suponiendo que existe un nodo por identificador, la tabla del nodo 1 ($p=1$) es:

| índice   | sucesor   |
|:-:|:-:|
| 1 | $ succ(1 + 2^{1-1}) = 2 $ |
| 2 | $ succ(1 + 2^{2-1}) = 3 $ |
| 3 | $ succ(1 + 2^{3-1}) = 5 $ |
| 4 | $ succ(1 + 2^{4-1}) = 9 $ |
| 5 | $ succ(1 + 2^{5-1}) = 17 $ |

Cada entrada contiene el identificador del primer sucesor a una distancia de al menos $2^{i-1}$ unidades.

Notar que $F_p[1]$ es el sucesor del nodo en el anillo.

Ahora, cuando un nodo $p$ recibe una consulta por una entidad con clave $k$:

- Responde la consulta si $k \in (pred(p), p]$
- Si $p < k \leq F_p[1]$ reenvia la consulta a su _sucesor_
- Caso contario, reenvia la consulta al nodo $i$ tal que $F_p[i] \leq k < F_p[i+1]$

El costo en general sera $O(log(N))$

### Ejemplo

Notar que no tienen que existir $2^m$ nodos: pueden haber muchos menos en el anillo.

Por ejemplo, para $F_p(1)$, $succ(2) = 4$ ya que el nodo 4 es responsable de las claves 2, 3 y 4.

![06-02.png](/06-02.png)

## Topología dinámica

Los nodos pueden entrar o salir del anillo, voluntariamente o por un fallo

Un nodo $p$ que quiera sumarse a una anillo Chord debe:

- Consultar a alguno de los nodos existentes $succ(p+1)$
- Cuando este nodo se identifica, se agrega como predecesor.

Se tienen que actualizar las _tablas finger_

- Periódicamente mediante algun hilo o proceso en segundo plano

Para la primer entrada ($F_p[1]$):

- Periodicamente cada nodo contacta su sucesor
- Consulta si sigue siendo el **predecesor de su sucesor**.
- Osea, el nodo $p$ verifica si $p=pred(succ(p+1))$
- Si no lo es, entonces se sumo un nuevo nodo $q$
    - Repite el proceso con $q$ como sucesor.

Para el resto de las entradas, debe encontrar el $succ(p + 2^{i-1})$

De manera similar, cada nodo debe verificar su **predecesor**:

- Si un nodo $q$ detecta que su predecesor no esta presente, lo marca como _desconocido_
- Si el nodo $q$ detecta que su sucesor no conoce a su predecesor, se presenta como tal
- De la misma manera, un nuevo predecesor se presentará como tal a $q$

## Proximidad

Un problema potencial es que dos nodos lógicamente próximos pueden estar físicamente lejanos

- Nodo 19 en Madryn, nodo 20 en Tokio, nodo 21 en Madrid

Posibles soluciones:

- Asignar los identificadores a nodos en base a la topología
    - Nodos físicamente cercanos tendrán identificadores próximos

- Ruteo por proximidad
    - Se mantienen varios sucesores por cada entrada de la _tabla finger_

- Selección del vecino más cercano
    - Válida cuando puede haber varios nodos que sirvan de predecesor.
    - No es el caso de Chord, pero sí de Pastry.







