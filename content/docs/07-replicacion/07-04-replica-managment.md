+++
title = 'Administración de réplicas'
date = 2024-10-15T01:30:03-03:00
draft = false
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
- Seleccionar las mejores $K$ ubicaciones de $M$ posibles ($K < M$)
- Y por lo tanto, computacionalmente costoso: se aplican heurísticas

Tipos de criterios para ubicar un servidor:
- Red (técnicos):
    - Latencia, ancho de banda, hops, etc.
- Económicos (costos)

Modelos para decidir donde ubicar una réplica:
- QoS: 
    - Optimizar uno o más parámetros de QoS
    - Ofrecer alguna garantía, por ejemplo de ancho de banda
    - Computacionalmente complejo, se aplican heurísticas
- Consistencia:
    - Tiene en cuenta los costos de mantener actualizadas las replicas
    - Subclases:
        - Actualizaciones periódicas / aperiódicas
        - Expiración
        - Caches
    - Basados en patrones de lectura/escritura
- Energía
    - Ubicación en base al consumo / gasto de energía
    - Por ejemplo, evitar servidores que esten ociosos
    - También maximizar el trabajo realizado por unidad de energía
- Otros (politicas, costos de CDNs, etc)

## Ubicación del contenido 

¿En qué replicas ubicar un cierto contenido?

Se pueden diferencias replicas:

### Permanentes
- Conjunto inicial de servidores
- Número relativamente pequeño, posiblemente estático
- En general, útiles como _backups_
- Ejemplo: _mirroring_
### Iniciadas por el servidor
- Objetivo: mejorar la perfomance.
- Generalmente con contenido _sólo-lectura_
- Ejemplo: _CDN_
### Iniciadas por el usuario
- Más conocidas como _caches_
- Administradas por el cliente
- Pueden ser compartidas por varios clientes.
- Mejoran el tiempo de acceso
- Ejemplo: _caches_ de navegadores web.

## Propagación

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

A.K.A *replicación pasiva*

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

