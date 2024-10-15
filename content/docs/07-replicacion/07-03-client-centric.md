+++
title = 'Consistencia centrada en el cliente'
date = 2024-10-14T23:05:03-03:00
draft = true
weight = 730 
type = 'docs'
+++

# Modelos de consistencia centrados en el cliente

Considerar un data store distribuido donde:

- no existen actualizaciones simultaneas o bien pueden ser fácilmente resueltas.
- la mayoría de las operaciones son de lectura.
- modelos de consistencia débil, por ejemplo eventual

Un data store así funciona bien mientras un cliente se conecte siempre a la misma replica.

- Los problemas aparecen si se conectan otra replica en un lapso corto de tiempo
    - Mas precisamente, en un lapso menor que el tiempo de propagación de las actualizaciones.

¿Cómo se pueden manejar las inconsistencias?

Se han propuesto una serie de modelos, conocidos como "centrados en el cliente"

- Se denominan así por que ofrecen garantías **para un único cliente**.

Existen principalmente cuatro modelos:

- [Lecturas monotónicas](#lecturas-monotónicas)  
- [Escrituras monotónicas](#escrituras-monotónicas)
- [Lee tus escrituras](#lee-tus-escrituras)
- [Escrituras siguen lecturas](#escrituras-siguen-lecturas)

En lo que sigue, la operación de lectura y/o escritura son realizadas por **el mismo proceso**

## Lecturas monotónicas

*Al leer el valor de un item **x**, una lectura posterior de dicho item devuelve el mismo valor o uno más reciente.*

En otras palabras, nunca se lee un valor más antiguo que el último leído.

Ejemplo: en un calendario online, siempre quiero leer la versión más reciente de un evento.

## Escrituras monotónicas

*La operación de escritura en un item **x** es finalizada antes que cualquier otra operación de escritura en el mismo item x*

En castellano, las operaciones de escritura son propagadas **en el mismo orden** a todas las réplicas.

Ejemplo: las modificaciones a un archivo deben siempre estar en el orden en que fueron realizadas.

## Lee tus escrituras

*Los efectos de una escritura en el item **x** serán siempre vistos por sucesivas lecturas de dicho item*

En criollo, cualquier operación de escritura es finalizada antes que cualquier operación de lectura *sin importar* en qué replica se realice.

Ejemplo: no ver contenido eliminado al conectarse a una replica diferente.

## Escrituras siguen lecturas

*Una escritura en el item x, posterior a una lectura de dicho item, modifica el valor previamente leído de x o uno más actualizado*

Sencillamente, cualquier operación de escritura en *x* será realizada sobre una copia de *x* con el valor más recientemente leído por el proceso.

Also: no se puede cambiar el pasado (la operación de escritura no modifacará un valor anterior a la última lectura).

Ejemplo: no se leen respuestas a un correo electrónico sin tener el correo electrónico al que se responde.

## Ejemplo real: consistencia en Zookeeper

Zookeeper garantiza que las actualizaciones son *serializables* y conservan la *precedencia*.

El estado es un ordenamiento lineal de *todas* las escrituras, respetando escrituras monotónicas.

En dicho estado, cada cliente ve reflejada sus operaciones **en el orden en que las envío**.

Zookeeper:

- respeta escrituras y lecturas monotónicas.
- no garantiza *lee tus escrituras* ni *escrituras siguen lecturas* 

![07-22.png](/07-22.png)


