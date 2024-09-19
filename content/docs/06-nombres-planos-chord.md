+++
title = 'Nombres planos - DHT'
date = 2024-09-18T23:06:02-03:00
draft = false
weight = 630
+++

# Chord

Chord es un sistema DHT (Distributed Hash Table) relativamente sencillo de entender.

Puede probar este [simulador](/chordgen/chordgen.html)

## Mecanismo general

Usa un espacio de $m$ bits para asignar identificadores a nodos y claves a entidades.

El número $m$ de bits usualmente esta entre 128 y 160.

Una entidad con clave $k$ es administrada por el nodo cuyo identificador $id$ sea $id \geq k$.

A dicho nodo se le denomina **sucesor** de $k$ y se denota como $succ(k)$

Problema: ¿Cómo resolver eficientemente $k$ a la dirección de $succ(k)$?

### Solución lineal

xxx

### Tablas finger

yyy


