+++
title = 'Comunicación'
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

## RPC

Los desarrolladores estan familiarizados con el paradigma procedural. Si un procedimiento esta diseñado de manera que funcione aislado, no hay impedimento en principio que pueda ejecutar en otra maquina.

Idea básica de RPC: Permitir invocar funciones remotas como si fueran locales.

Idea sencilla pero de implementación compleja. Contribuye a la transparencia de distribución, especialmente a la transparencia de acceso. Problemas: falta de un espacio de direcciones común, diferencia en arquitecturas, caída de alguno de los procesos que se comunican, etc.

El proceso cliente invoca una función local que se denomina _stub_, que tiene la misma sintaxis que la función remota deseada, pero que se encarga de agrupar los parámetros en un mensaje y enviarlo al servidor, esperar la respuesta y desampaquetar los datos y retornar el resultado de la invocación.

En el servidor ocurre algo análogo: una funcion _stub_ recibe la petición, desempaqueta los parámetros e invoca la función local en el servidor, y luego envía la respuesta a al cliente.

### Paso de parámetros

Aspecto dificultoso del esquema RPC:

- ¿Cómo interpretar los párametros?
- ¿Cómo asegurar la misma representación de los datos?
    - Existen diferencias en las arquitecturas, por ejemplo ordenamiento de los bytes o tamaño de palabras.
    - Distintos lenguajes tiene diferentes tipos de datos.

_Solución_: enviar datos en un formato independiente de la maquina.

- Por ejemplo, se utiliza big endian para ordenar los bytes en los mensajes en la red.
- Acuerdo en la codificación de tipos basicos y complejos.

¿Cómo pasamos punteros? 

- Prohibirlos (no es realista)
- Serializar toda la estructura de datos (por ejemplo el arreglo, lista, etc)
- Generalmente se puede utilizar un _handle_. Por ejemplo, nombre de archivo o url.

### Soporte

Dos alternativas:

- Especificar detalladamente funciones y parametros, para generar _stubs_.
    - Indicar como empaquetar el nombre de la función y sus parámetros.
    - Representación de los tipos de datos.
    - Decidir en el mecanismo de comunicación, por ejemplo mediante TCP/IP.
    - La interface es especificada mediante un IDL (Interface Definition Language).
    - Mediante un programa específico, la descripción mediante IDL es compilada en _stubs_.

- Incorporar la funcionalidad en el lenguaje de programación.
    - Facilita el desarrollo de la aplicación.
    - Ej: Java cuenta con RMI (Remote Method Invocation)

Descubrimiento: 

- ¿Cómo puede el cliente saber qué servidor implementa la funcionalidad requerida?
- Solucion 1: el servidor puede ser bien conocido.
- Solucion 2: usar un servicio de directorio:
    - El servidor registra en un directorio el servicio que ofrece y su dirección.
    - El cliente contacta el directorio y consulta por un servicio en particular.
    - El cliente se conecta al servidor que le indica el directorio.

### Variantes

- **RPC sincrónico**: el emisor espera a que el receptor ejecute la función.
- **RPC asincrónico**: el emisor sólo espera hasta la confirmación de recepción por parte del emisor.
- **RPC diferido**: RPC asincrónico más un _callback_ que se ejecuta al recibir la respuesta del receptor.
    - Alternativamente al _callback_, el cliente puede realizar un _polling_.
- **one-way RPC**: el emisor genera el RPC pero no espera ni siquiera la confirmación de recepción.
- **RPC Multicast**: uso de _one-way RPC_ para enviar múltiples peticiones, posiblemente con un callback.
    - La aplicación puede no conocer que se realiza un multicast, lo oculta el _stub_.
    - Es posible que tampoco lo sepa el _stub_, si se realiza mediante multicast en la capa de transporte.
    - ¿Cómo procesar las respuestas? ¿La primera unicamente, todas? Depende de la aplicación.

