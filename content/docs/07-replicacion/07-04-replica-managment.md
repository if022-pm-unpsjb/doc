+++
title = 'Administración de réplicas'
date = 2024-10-15T01:30:03-03:00
draft = true
weight = 740 
type = 'docs'
+++

# Administración de réplicas

¿Dónde ubicar las réplicas? Dos aspectos:

- Distribución física de los servidores.
- Distribución del contenido en dichos servidores.

¿Qué mecanismos utilizar para mantener las replicas (eventualmente) consistentes?

## Ubicación física

Hoy quiza no tan relevante dada la computación en la nube.

Se resume en un problema de optimización.

- Y por lo tanto, computacionalmente costoso: se aplican heurísticas

Criterios:
- Red (técnicos)
- Económicos (costos)

Tipos de modelos:
- QoS: optimización / cota
- Consistencia:
    - Actualizaciones periódicas, aperiódicas, por expiración, caches.
- Energía
- Otros

## Ubicación del contenido

¿En qué replicas ubicar un cierto contenido?

Se pueden diferencias replicas:
- Permanentes
- Iniciadas por el servidor
- Iniciadas por el usuario

¿Qué propagar?
- Notificaciones
- Datos
- Operaciones

### Notificaciones

A.K.A *protocolos de invalidación*

Las replicas son *notificadas* que los datos ya no son actuales.

Las replicas luego deben iniciar un mecanismo de actualización.

Requiere poco ancho de banda.

Conveniente cuando existen más operaciones de actualización que de lectura.
- Relación *Read-to-write* pequeña.

### Datos

Se transfieren los datos modificados a las replicas.

Puede transferirse todo o sólo las modificaciones (ejemplo, un *diff*).

Una misma comunicación puede incluir múltiples actualizaciones.

Conveniente cuando el número de lecturas es mayor que las actualizaciones.
- Relación *Read-to-Write* alta.

### Operaciones

A.K.A *replicación activa*

Consiste en *propagar la operación de actualización*, posiblemente con parámetros.

Reduce el ancho de banda requerido.

Sin embargo, puede incrementar el costo computacional en las réplicas.

## Pull vs Push

Dilema: ¿envío o recibo?

### Push

A.K.A *protocolos basados en el servidor*

Las actualizaciones son propagadas sin necesidad de que sean solicitadas.

Utilizado generalmente con las replicas iniciadas por el servidor.

Ùtil cuando se requiere un modelo de consistencia fuerte.
- Ratio *Read-to-Update* alto.

### Pull

A.K.A *protocolos basados en el cliente*

El cliente solicita el envío de las actualizaciones.

Muy utilizado para el manejo de las *caches*.

Eficiente cuando el ratio *Read-To-Update* es bajo.

### Lease

Es un enfoque híbrido.

Se obtiene una "promesa" del servidor que enviará una actualización.

Basados en:
- Antigüedad
- Frecuencia de actualización
- Estado del servidor

### Comparativa

Según estado del servidor:
- Push requiere conocer las replicas y su estado.
- Pull no requiere información de las replicas.

Mensajes:
- Push requiere enviar mensajes de actualización (y quiza fetchs)
- Pull requiere mensajes de polling y fetchs/update.

Tiempo de respuesta:
- Inmediato (o lo que tarde el fetch-update)
- Lo que requiera el fetch-update.

