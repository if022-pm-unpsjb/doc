+++
title = 'Nombres, identificadores y direcciones'
date = 2024-09-18T23:06:01-03:00
draft = false
weight = 600
+++

# Nombres, identificadores y direcciones

En el contexto de sistemas distribuidos, vamos a decir que un nombre es un conjunto de bits.

## Entidades

El principal uso de un nombre es permitir identificar una **entidad**.

Una **entidad** puede ser cualquier cosa: una página web, una impresora, un proceso.

En general, una entidad se puede _operar_.

- Por ejemplo, si la entidad es una impresora, se puede enviar un documento para su impresión.

## Puntos de acceso

Para operar una entidad se requiere acceder a la misma mediante un **punto de acceso**.

- Un **punto de acceso** es una entidad... y requiere un nombre.
- Una entidad puede tener uno, dos o más puntos de acceso.
- El punto de acceso puede cambiar con el tiempo.
- Ejemplo: `200.45.21.42:80`

## Dirección

Una dirección es un nombre que identifica la _ubicación_ de una entidad.

El nombre de un **punto de acceso** es una **dirección**.

Es mucho más flexible mantener el nombre de una entidad independiente de su dirección.

- La entidad puede moverse de ubicación, con lo cual cambia su dirección

- Se conoce como **independencia de ubicación**

## Identificadores

Los nombres que refieren univocamente a una entidad se conocen como **identificadores**

Todo **identificador** que se precie cumple con lo siguiente:

1. Refiere a una única entidad.
2. Dicha entidad sólo es referenciado por ese identificador.
3. Nunca es reutilizado.

Muchas veces un **nombre** o un **identificador** esta pensando para que lo lea una computadora.

- Por ejemplo, una cadena ilegible como una dirección MAC: `00:26:c7:d9:98:54`

Pero otros nombres son diseñados para que sean fácilmente legibles por un humano.

- Ejemplo: nombres de archivo, DNS

## Resolución de nombres

Tiene que existir un mecanismo que resuelva los nombres.

Esto es, obtenga información acerca de la entidad en base a su nombre.

¿Cómo resolvemos un nombre a una entidad? Dos opciones:

1. Mantener un registro de tipo `(nombre, dirección)`

2. Realizar un ruteo hacia la **dirección** o **punto de acceso**

![dns-lookup](/dns-lookup.png)
