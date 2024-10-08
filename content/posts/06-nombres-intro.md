+++
title = 'Nombres, identificadores y direcciones'
date = 2024-09-18T23:06:01-03:00
draft = true
+++

Un nombre es un conjunto de bits que permiten identificar una **entidad**.

Una **entidad** puede ser cualquier cosa: una página web, una impresora, un proceso.

En general, una entidad se puede _operar_.

- Por ejemplo, si la entidad es una impresora, se puede enviar un documento para su impresión.

Para operar una entidad se requiere acceder a la misma, mediante un **punto de acceso**.

- Un **punto de acceso** es una entidad en un sistema distribuido... y requiere un nombre.
- Una entidad puede tener uno, dos o más puntos de acceso.
- El punto de acceso puede cambiar con el tiempo.
- Ejemplo: IP:PUERTO

El nombre de un **punto de acceso** se conoce como **dirección**.

Es mucho más flexible mantener el nombre de una entidad independiente de su dirección.

- Se conoce como **independencia de ubicación**

Los nombres que refieren univocamente a una entidad se conocen como **identificadores**

1. Refiere a una única entidad.
2. Cada entidad es referida solamente por un identificador.
3. Los identificadores no se reutilizan.

En general, **nombres** e **identificadores** son representados machine-readable.

Otros nombres son diseñados para que sean fácilmente legibles por un humano.

- Ejemplo: nombres de archivo, DNS

¿Cómo resolvemos un nombre a una entidad? Dos opciones:

1. Mantener un registro (nombre, dirección)
2. Realizar un ruteo hacia la **dirección** o **punto de acceso**

