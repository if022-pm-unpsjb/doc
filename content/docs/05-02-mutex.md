+++
title = 'Mutex'
date = 2024-09-18T23:05:01-03:00
draft = false
weight = 520
+++

# Exclusión mutua

- Coordinar el acceso exclusivo a un recurso.

- Estrategias:
    - Mediante permisos: acuerdo entre los procesos.
    - Utilizando un token: quien tiene el token, accede al recurso.

## Centralizado

- Uso de un coordinador que otorga el acceso al recurso
- Facil de implementar, sencillo de mantener. 
- Posibles problemas para escalar.

## Descentralizado

- Recurso con N replicas, cada una con un coordinador asignado.
- Acceder al recurso requiere votos positivos de al menos m > N/2 coordinadores.

## Distribuido

- Uso de multicast totalmente ordenado para coordinar el acceso.
- Requiere poder contactar a todos los procesos interesados en el mismo recurso.

## Token ring

- Procesos organizados en un anillo lógico.
- Token circula por el anillo.
- Quien tiene el token puede acceder al recurso.

## Comparación

- Centralizado:
    - Requiere 3 mensajes para acceder/liberar el recurso (petición, recepción del ok, liberación).
- Distribuido:
    - Si existen _N_ nodos, debo envíar mensajes a cada uno y esperar confirmación de ok: _2(N-1)_ mensajes.
- Token-ring:
    - El token puede recorrer indefinidamente el anillo hasta ser retenido para el acceso al recurso.
    - En el peor caso un nodo debe esperar _N-1_ mensajes hasta que le llegue el token (suponiendo un anillo de _N_ nodos)

## Ejemplo: exclusion mutua con Zookeeper

- En la práctica muchos sistemas distribuidos utilizan un coordinador centralizado

- [Zookeeper](https://zookeeper.apache.org/) ofrece servicios para:
    - exclusion mutua
    - elección de lider
    - monitoreo
    - etc
- Diseñado para ofrecer confiabilidad, tolerancia a fallas y escalabilidad
    - Aunque logicamente centralizado, [su implementación es un sistema distribuido](https://zookeeper.apache.org/doc/current/zookeeperOver.html#sc_designGoals)
- Usar zookeeper o servicios similares: ¡no hay que reinventar la rueda! (sobre todo una rueda complicada)

- [Zookeeper 101](https://zookeeper.apache.org/doc/current/zookeeperOver.html#sc_dataModelNameSpace):
    - No hay primitivas bloqueantes
        - Las peticiones de un cliente siempre reciben una respuesta.
    - Ofrece un espacio de nombres, similar a un sistema de archivos.
    - Operaciones:
        - crear y eliminar nodos
        - leer y actualizar datos en nodos (las actualizaciones son completas, no parciales)
        - verificar si existe un nodo en particular
    - Tipos de nodos:
        - persistentes: deben ser creados y eliminados explicitamente
        - efímeros: son eliminados cuando la conexión del proceso que los creo se pierde
    - Servicio de notificaciones
        - Evita polling por parte de los clientes.

- Ejemplo: obtener acceso exclusivo a un recurso
    - Un proceso crea un nodo, por ejemplo con nombre `/lock`
    - Si existe, la operación falla indicando que ya existe
    - El proceso debe repetir la operación para obtenerlo
    - En caso de crearlo, para liberar el acceso elimina el nodo `/lock`
    - Problemas:
        - ¿que sucede cuando un cliente crea `/lock` y desaparece?
        - Proceso p2 puede solicitar notificaciones por `/lock` mientras `/lock` es eliminado
        - Estas sutilezas y muchas más son manejadas por zookeeper.

