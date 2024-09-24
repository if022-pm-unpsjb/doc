+++
title = 'Chord'
date = 2024-09-18T23:06:02-03:00
draft = false
weight = 630
+++

# Chord

[Chord](https://en.wikipedia.org/wiki/Chord_(peer-to-peer)) es un sistema [DHT](https://en.wikipedia.org/wiki/Distributed_hash_table) (Distributed Hash Table) relativamente sencillo de entender, utilizado en redes [p2p]({{< ref "02-arquitectura.md#arquitecturas-simétricas" >}})

Algunos links interesantes:
- [Paper original](https://doi.org/10.1145%2F964723.383071)

## Simulador

Pueden probar como funciona Chord con este [simulador](/chordgen/chordgen.html)

## Mecanismo general

Usa un espacio de $m$ bits para asignar identificadores a nodos y claves a entidades.

El número $m$ de bits usualmente esta entre 128 y 160.

Una entidad con clave $k$ es administrada por el nodo cuyo identificador $id$ sea $id \geq k$.

A dicho nodo se le denomina **sucesor** de $k$ y se denota como $succ(k)$

Problema: ¿Cómo resolver eficientemente $k$ a la dirección de $succ(k)$?

### Solución lineal

xxx

### Tablas finger

Cada nodo mantiene una tabla de $m$ entradas:

$$ F_p[i] = succ((p + 2^{i-1}) \quad mod \quad 2^m) $$

Por ejemplo, con $m=5$ ($2^5=32$ nodos) la tabla del nodo 1 ($p=1$) es:

| índice   | sucesor   |
|:-:|:-:|
| 1 | $ F_1[1] = 1 + 2^{1-1} = 2 $ |
| 2 | $ F_1[2] = 1 + 2^{2-1} = 3 $ |
| 3 | $ F_1[3] = 1 + 2^{3-1} = 5 $ |
| 4 | $ F_1[4] = 1 + 2^{4-1} = 9 $ |
| 5 | $ F_1[5] = 1 + 2^{5-1} = 17 $ |

![06-02.png](/06-02.png)
