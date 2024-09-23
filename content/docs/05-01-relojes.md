+++
title = 'Relojes'
date = 2024-09-18T23:05:01-03:00
draft = false
weight = 500
+++

# Relojes

En un sistema centralizado `x = timestamp(); y = timestamp()` da como resultado \\( x \leq y \\).

En un sistema distribuido, acordar en un valor temporal no es trivial.

¿Es posible sincronizar los relojes de los nodos de un sistema distribuido? La respuesta es sorprendentemente complicada.

Entonces... ¿Cómo coordinan sus actividades los procesos de un sistema distribuido?

## Relojes físicos

Existen situaciones donde es necesario que todos los nodos en un sistema acuerden en un valor de tiempo determinado.

Un reloj físico presenta _deriva_

Problemas:

1. ¿Cómo sincronizamos el reloj interno con un reloj externo?
2. ¿Cómo sincronizamos los relojes internos entre sí?

### UTC

Coordinated Universal Time: estándar internacional 

40 emisoras de onda corta difunden una señal al comienzo de cada segundo UTC

- Precisión $\pm 1$ ms a $\pm 10$ ms

Uso de satelites, por ejemplo GPS y relojes atómicos

- Precisión $\pm 0,5$ ms 

### Sincronización de relojes

Suponer un conjunto de nodos:
- Desafio 1: que esten sincronizados con una referencia externa, por ejemplo UTC.
- Desafio 2: que los relojes de los nodos difieran lo menos posible.

**Exactitud**: mantener la desviación con respecto a una *fuente externa* dentro de un rango específico.
**Precisión**: mantener la desviación entre dos relojes dentro de un rango específico.

Sincronización externa: mantener los relojes _exactos_.

Sincronización interna: mantener los relojes _precisos_.

Problema:
- Los relojes fisicos no son exactos, presentan deriva
- El reloj por software se basa en el reloj hardware
- Segun la deriva un reloj puede ser más rapido o más lento en referencia a un reloj ideal

Fun facts:
- Dos relojes exactos pueden ser precisos con una cota $2 \delta$
- Sin embargo, ser precisos **no indica** nada acerca de la exactitud.

Servidor de tiempo:
- Obtener un valor actualizado desde un servidor central (por ejemplo, que tenga un reloj UTC)
- Implementación mediante una arquitectura cliente/servidor:
    - Servidor retorna al cliente respuesta con timestamp.
    - Cliente debe compensar el _offset_ y _delay_.

### NTP

Network Time Protocol

### Ambientes inalambricos:

Requieren algoritmos diferentes

Ejemplo: Reference Broadcast Synchronization

## Relojes lógicos

Generalmente lo que importa es que los nodos esten de acuerdo en el _orden_ de los eventos.

### Relación _happened-before_

- $a$ y $b$ son eventos
- Si $a$ ocurre antes que $b$ en un mismo proceso, entonces $a \rightarrow b$
- Si $a$ es el envío de un mensaje y $b$ la recepción, entonces $a \rightarrow b$
- Transitivo: si $a \rightarrow b$ y $b \rightarrow c$, entonces $a \rightarrow c$
- Introduce un **ordenamiento parcial** sobre los eventos.

### Diseño

- Cada evento $e$ tiene asociado un timestamp $C(e)$
- Propiedad 1: si $a$ y $b$ son eventos en un mismo proceso y $a \rightarrow b$ entonces $C(a) < C(b)$
- Propiedad 2: si $a$ y $b$ son envío y recepción de un mensaje respectivamente, entonces $C(a) < C(b)$

### Implementación

- Cada proceso $P_i$ mantiene un reloj lógico $C_i$
- Por cada evento en $P_i$, $C_i = C_i + 1$
- Cada mensaje enviado por _Pi_ tiene un timestamp _ts(m)_ = _C(i)_ 
- Cuando _Pj_ recibe un mensaje _m_:
    - Ajusta su contador _Cj_ con el máximo valor entre _Cj_ y _ts(m)_
    - Antes de pasar el mensaje a la aplicación, incrementa _Cj_ en uno.

El servicio de relojes lógicos es implementado en un middleware, idealmente la aplicación no tiene por que ocuparse.

### Ejemplo

{{< logical-clocks >}} 

### Multicast totalmente ordenado

Es posible realizar un multicas totalmente ordenado mediante el uso de relojes lógicos:w

## Relojes vectoriales

Al usar relojes lógicos si $C(a) < C(b)$ no implica que $a$ ocurra antes que $b$

Solución: relojes vectoriales

- Cada nodo mantiene su propio reloj lógico
- Mantiene información de los relojes lógicos del resto de los nodos
- Se organizan como un vector o arreglo
    - $V[i]$ es el reloj lógico del nodo $i$
    - $V[j]$ es el reloj lógico del nodo $j$

Ahora el timestamp asociado a cada mensaje es un vector: _ts(m)_ = _VC_

Para comparar dos relojes vectoriales, _VCa_ < _VCb_ si y solo si:

- _VCa[k]_ <= _VCb[k]_ para cualquier _k_
- existe al menos un k' tal que _VCa[k']_ < _VCb[k']_

Si se cumple _VCa_ < _VCb_ entonces un evento precede causalmente a otro.

Implementación: similar al reloj lógico

Ejemplo de uso: multicast totalmente ordenado.

{{< vector-clocks >}} 
