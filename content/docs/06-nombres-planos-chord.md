+++
title = 'Chord'
date = 2024-09-18T23:06:02-03:00
draft = false
weight = 630
+++

# Chord

[Chord](https://en.wikipedia.org/wiki/Chord_(peer-to-peer)) es un sistema [DHT](https://en.wikipedia.org/wiki/Distributed_hash_table) (Distributed Hash Table) relativamente sencillo de entender, utilizado en redes [p2p]({{< ref "02-arquitectura.md#arquitecturas-simétricas" >}})

Sistemas similares:
- [Pastry](https://en.wikipedia.org/wiki/Pastry_(DHT))
- [Tapestry](https://en.wikipedia.org/wiki/Tapestry_(DHT))

## Material de lectura

Estos apuntes estan basados en:

- La sección *6.2.3 Distributed Hash tables* del libro *Distributed Systems*, donde se describe brevemente Chord. No es necesario leer la nota avanzada, pero sí la subsección *Exploiting network proximity*.

- En el [paper original](https://pdos.csail.mit.edu/papers/chord:sigcomm01/chord_sigcomm.pdf). Recomendado leer la sección 1 y la sección 4.3 (hasta el Teorema, que no es necesario leer ni entender).

## Simulador

Pueden probar como funciona Chord con este [simulador](/chordgen/chordgen.html)

## Descripción

Es un sistema de _lookup_ distribuido.

En criollo: dado una _clave_ (nombre) obtiene el nodo asociado.

- Ej: `lookup(key)` retorna la IP del nodo asociado.

- Y lo trata de hacer de manera _eficiente_

El protocolo especifica:

- Como realizar el _lookup_ (obviamente).

- Como nuevos nodos se unen al sistema.

- Como manejar la salida de nodos (planeada o no).

## Propiedades bonitas

- Balanceo de carga

- Descentralizado

- Escalable

- Alta disponibilidad

- Flexibilidad en asignación de nombres

(Estas propiedades son las que debe tener cualquier servicio de nombres)

## Descripción general

Usa un espacio de $m$ bits para asignar **identificadores** a nodos y **claves** a entidades.

El número $m$ de bits usualmente esta entre 128 y 160.

- Tiene que ser lo suficientemente grande para evitar colisiones.

Requiere *hash consistente* para distribuir de manera uniforme las claves en el espacio de nombres.

- Ej: SHA1
- El objetivo es todos los nodos administren (aproximadamente) la misma cantidad de claves.

Una entidad con clave $k$ es administrada por el nodo con el menor identificador $p$ tal que $p \geq k$.

- Para simplificar, vamos a decir que la entidad $k$ es administrada por el nodo $p$, tal que $p \geq k$

Dicho nodo se denomina **sucesor** de $k$ y se denota $succ(k)$

Los nodos se organizan en un **anillo**

- Cada nodo mantiene referencias a su *sucesor* y *predecesor*

## Resolución de nombres

Problema: Dado un clave $k$ ¿Cómo resolver la dirección de $succ(k)$?

### Solución lineal

Veamos primero una solución que sencilla, que **no** usa Chord.

Lo más simple es pasar la consulta al siguiente nodo en el anillo.

Cuando un nodo $p$ recibe una consulta por una entidad $k$

- Responde la consulta si $pred(p) < k \leq p$
- Caso contrario, pasa la consulta a $succ(p+1)$

En promedio, una consulta requerirá recorrer **la mitad del anillo**.

### Solución exponencial

Chord intenta resolver **eficientemente** la dirección de $succ(k)$

Cada nodo mantiene una tabla con $s \leq m$ entradas conocida como _tabla finger_

La tabla del nodo $p$ se denota $F_p$

Cada entrada $i$ contiene lo siguiente:

$$ F_p[i] = succ((p + 2^{i-1}) \quad mod \quad 2^m) $$

Por ejemplo, con $m=5$ ($2^5=32$ identificadores), la tabla del nodo 1 ($p=1$) es:

| índice   | sucesor   |
|:-:|:-:|
| 1 | $ succ(1 + 2^{1-1}) = 2 $ |
| 2 | $ succ(1 + 2^{2-1}) = 3 $ |
| 3 | $ succ(1 + 2^{3-1}) = 5 $ |
| 4 | $ succ(1 + 2^{4-1}) = 9 $ |
| 5 | $ succ(1 + 2^{5-1}) = 17 $ |

Cada entrada contiene el identificador del primer sucesor a una distancia de al menos $2^{i-1}$ unidades.

Cada nodo sólo guarda una cantidad reducida de información de los demás.

Notar que $F_p[1]$ es el sucesor del nodo en el anillo.

Ahora, cuando un nodo $p$ recibe una consulta por una entidad con clave $k$:

- Responde la consulta si $k \in (pred(p), p]$
- Si $p < k \leq F_p[1]$ reenvia la consulta a su _sucesor_
- Caso contrario, reenvia la consulta al nodo $i$ tal que $F_p[i] \leq k < F_p[i+1]$

El costo en general sera $O(log(N))$

### Ejemplo

Notar que no tienen que existir $2^m$ nodos: pueden haber muchos menos en el anillo.

Por ejemplo, para $F_p(1)$, $succ(2) = 4$ ya que el nodo 4 es responsable de las claves 2, 3 y 4.

![06-02.png](/06-02.png)

## Topología dinámica

Los nodos pueden entrar o salir del anillo, voluntariamente o por un fallo

Un nodo $p$ que quiera sumarse a una anillo Chord debe:

- Consulta $succ(p+1)$ a alguno de los nodos existentes
- Luego se agrega como predcesor de $succ(p+1)$

Se tienen que actualizar las _tablas finger_

- Periódicamente mediante algun hilo o proceso en segundo plano

Para la primer entrada ($F_p[1]$, o sea el sucesor):

- Periodicamente consulta si sigue siendo el **predecesor de su sucesor**.
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

