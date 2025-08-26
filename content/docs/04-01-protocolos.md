+++
title = 'Protocolos de comunicación'
date = 2024-09-18T23:04:01-03:00
draft = false
weight = 400
+++

# Comunicación

Fundamental en un sistema distribuido. Las primitivas de comunicación que ofrece el sistema operativo pueden no tener el nivel de abstracción necesario.

## Fundaciones

### El modelo OSI

Modelo de siete capas, no utilizado en la práctica, pero que es una referencia útil acerca de como esta estructurado lógicamente el stack de comunicación.

### Middleware

Los servicios middleware para un sistema distribuido estarían logicamente ubicados en las capas de sesión y presentación del modelo OSI, aunque también pueden incorporar servicios en la capa de aplicación.

## Tipos de comunicación

El middleware puede ser visto como un servicio adicional que media en la comunicación en una arquitectura cliente/servidor.

Los tipos de comunicación se pueden categorizar en:

- **Persistente**: 
    - El mensaje es almacenado por el middleware todo el tiempo que sea necesario para realizar la entrega.
    - El emisor no necesita esperar a que se complete la recepción.
    - El receptor no tiene por que estar ejecutando al ser enviado el mensaje.

- **Transitoria**: 
    - El mensaje es almacenado únicamente el tiempo suficiente para el envío, sólo si emisor y receptor estan ejecutando.
    - Cualquier error descarta el mensaje.

- **Asincrónica**: 
    - El emisor continua con la ejecución luego de envíar el mensaje, quiza sin confirmación de envío ni recepción.

- **Sincrónica**:
    - El emisor se bloquea hasa que el mensaje sea aceptado (envío, recepción, procesamiento).

