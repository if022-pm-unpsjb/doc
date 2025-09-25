+++
title = 'Nombres, identificadores y direcciones'
date = 2024-09-18T23:06:01-03:00
draft = false
weight = 600
+++

# Nombres, identificadores y direcciones

Vamos a considerar que un nombre es un conjunto de bits o caracteres utilizado para referirse a una _entidad_.

## Entidades

El principal uso de un nombre es permitir identificar una **entidad**.

Una **entidad** puede ser cualquier cosa: una página web, una impresora, un proceso.

En general, se puede realizar una actividad u operación sobre la entidad:

- Por ejemplo, si nos referimos a una impresora, se puede enviar un documento para su impresión.

## Puntos de acceso

Para operar una entidad se requiere acceder a la misma mediante un **punto de acceso**.

- Un **punto de acceso** es una entidad... y requiere un nombre.
- Una entidad puede tener uno, dos o más puntos de acceso.
- El punto de acceso puede cambiar con el tiempo.
- Ejemplo: `200.45.21.42:80`

## Dirección

El nombre del **punto de acceso** a una entidad se denomina **dirección**.

Por flexibilidad el **nombre** de una **entidad** debería ser independiente de su **dirección**.

- La entidad puede moverse de ubicación, con lo cual cambia su dirección.

- Se conoce como **independencia de ubicación**.

## Identificadores

Un nombre que refiere univocamente a una entidad se conoce como **identificador**.

Todo **identificador** que se precie cumple con lo siguiente:

1. Refiere a una **única entidad**.
2. Cada entidad es referenciada por un único identificador.
3. Nunca es reutilizado.

Muchas veces una **dirección** o un **identificador** esta pensando para ser leído por una computadora.

- Por ejemplo, una cadena ilegible como una dirección MAC: `00:26:c7:d9:98:54`

Otros nombres son diseñados para que sean fácilmente legibles por un humano.

- Ejemplo: nombres de archivo, DNS, etc.

## Resolución de nombres

Tiene que existir un mecanismo que resuelva nombres en direcciones.

- Esto es, obtener información del punto de acceso de la entidad en base a su nombre.

Básicamente hay dos opciones:

1. Mantener un registro (quizá distribuido) de tipo `(nombre, dirección)`

2. Realizar un ruteo hacia la **dirección** o **punto de acceso**

    - Generalmente utilizado en redes p2p.

![dns-lookup](/dns-lookup.png)
