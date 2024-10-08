+++
title = 'Consistencia centrada en datos'
date = 2024-09-18T23:04:03-03:00
draft = false
weight = 720 
type = 'docs'
+++

# Modelos de consistencia centrado en datos

## Generalidades

Suponer un *data store* replicado en varias máquinas (nodos).

Un **modelo de consistencia** es un **contrato** entre los clientes y el **data store**

- Si se respeta el contrato, todos contentos

Por ejemplo, normalmente un cliente espera que una lectura refleje la última escritura.

¿Pero qué es la **última escritura** en un sistema distribuido?

- ¡No tenemos un reloj global!

Diferentes modelos de consistencia dan una respuesta distinta:

- En un extremo, los modelos "relajados":

    - Mejor desempeño
    - Más complicados de implementar / entender.

- En el otro, los modelos "estrictos":

    - Menor desempeño.
    - Más fáciles de entender / utilizar.

**No existe el modelo de consistencia ideal** 

## Orden consistente de las operaciones

### Consistencia secuencial

**Cualquier** orden de operaciones de lectura / escritura es válido.

**Todos** los nodos deben ver el mismo orden de operaciones.

Debe respetar el orden de operaciones en **cada programa**.

Por lo tanto, los clientes deben **aceptar** cualquier orden (válido) de lectura.

Ejemplos: 
- [Zookeeper](https://zookeeper.apache.org/doc/current/zookeeperOver.html#Guarantees)
    - Zookeeper logra la consistencia secuencial mediante su protocolo [ZAB](https://zookeeper.apache.org/doc/r3.3.6/zookeeperInternals.html)

Mas info: 

- [Jepsen](https://jepsen.io/consistency/models/sequential)

### Consistencia causal

Tiene en cuenta las operaciones que pueden estar **causalmente** relacionadas.

Entonces, si $a \rightarrow b$ todos los procesos deben ver primero $a$ y luego $b$.

Las operaciones **concurrentes** pueden aparecer en **cualquier orden**.

Requiere mantener información de qué proceso vio cuál actualización.

Ejemplo: 

- [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

Mas info:

- [Jepsen](https://jepsen.io/consistency/models/causal)

### Agrupamiento de operaciones 

Uso de secciones críticas (ingreso y salida).

Al ejecutar un ingreso, el proceso sabe que todos los datos de su _data store_ estan actualizados.

El uso de estos *locks* debe respetar la *consistencia secuencial*

## Consistencia eventual

Se basa en la siguiente observación:

- La mayoría de los procesos realizan **lecturas**
- Sólo unos pocos nodos realizan **escrituras**

¿Que tán rápido deberían propagarse estos cambios?

Si lo clientes se conectan siempre a la misma replica... en general no verían inconsistencias.

- Podemos propagar los cambios de manera "lenta" (ideal para WANs)

Un ejemplo son las páginas web.

Dado un lapso de tiempo **eventualmente** todas las replicas tendrán el mismo valor.

- Suponiendo que no existen conflictos *write / write*

- Requiere que se garantice que las actualizaciones serán enviadas a _todas_ las replicas.

Bueno, suponer que no hay conflictos es algo ideal:

Problemas *write/write*:
    
- Son pocos los nodos que escriben, se pueden solucionar fácilmente
    - Por ejemplo una de las operaciones *write* sobreescribe al resto.
- Uso de [CRDT](https://crdt.tech/) (conflict-free data types)
    - Permiten actualización sin necesidad de coordinación
    - Consistencia eventual fuerte: aún cuando haya conflictos, las replicas donde se aplicaron tendrán el mismo estado.
- Si todo falla, utilizar algun mecanismo de exclusión mutua.

Ejemplos:

- [CosmosDB](https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels#eventual-consistency)
- [Cassandra](https://cassandra.apache.org/doc/latest/cassandra/architecture/guarantees.html#eventual-consistency)

## Consistencia continua

Muchas aplicaciones pueden tolerar falta de consistencia.

Pero requieren también definir algun tope o cota a dicha inconsistencia.

En general, especifican una desviación tolerable como un rango sobre un atributo:

- Desviación numérica
    - Absoluta
    - Relativa
- Antigüedad
- Orden de los eventos
- Número de actualizaciones

### Conit

Unidad de consistencia (_consistency unit_)

Especifica la _unidad_ sobre la cual la consistencia va a ser medida.

- Ejemplo, una acción en un mercado de valores.

