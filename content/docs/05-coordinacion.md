+++
title = 'Coordinación'
date = 2024-09-18T23:05:01-03:00
draft = false
weight = 500
+++

# Coordinación

En un sistema centralizado `x = timestamp(); y = timestamp()` da como resultado \\( x \leq y \\).

En un sistema distribuido, acordar en un valor temporal no es trivial.

¿Es posible sincronizar los relojes de los nodos de un sistema distribuido? La respuesta es sorprendentemente complicada.

Entonces... ¿Cómo coordinan sus actividades los procesos de un sistema distribuido?

## Relojes físicos

- Existen situaciones donde es necesario que todos los nodos en un sistema acuerden en un valor de tiempo determinado.

- Un reloj físico presenta _deriva_

- Problemas:
    1. ¿Cómo sincronizamos el reloj interno con un reloj externo?
    2. ¿Cómo sincronizamos los relojes internos entre sí?

- UTC:
    - Coordinated Universal Time
    - Estándar internacional 
    - 40 emisoras de onda corta difunden una señal al comienzo de cada segundo UTC
        - Precisión $\pm 1$ ms a $\pm 10$ ms
    - Uso de satelites, por ejemplo GPS y relojes atómicos
        - Precisión $\pm 0,5$ ms 

- Sincronización de relojes:
    - Suponer un conjunto de nodos:
        - Desafio 1: que esten sincronizados con una referencia externa, por ejemplo UTC.
        - Desafio 2: que los relojes de los nodos difieran lo menos posible.
    - _Exactitud_: mantener la desviación con respecto a una *fuente externa* dentro de un rango específico.
    - _Precisión_: mantener la desviación entre dos relojes dentro de un rango específico.
    - Sincronización externa: mantener los relojes _exactos_.
    - Sincronización interna: mantener los relojes _precisos_.
    - Problema:
        - Los relojes fisicos no son exactos, presentan deriva
        - El reloj por software se basa en el reloj hardware
        - Segun la deriva un reloj puede ser más rapido o más lento en referencia a un reloj ideal
    - Fun facts:
        - Dos relojes exactos pueden ser precisos con una cota $2 \delta$
        - Sin embargo, ser precisos **no indica** nada acerca de la exactitud.

- Servidor de tiempo:
    - Obtener un valor actualizado desde un servidor central (por ejemplo, que tenga un reloj UTC)
    - Implementación mediante una arquitectura cliente/servidor:
        - Servidor retorna al cliente respuesta con timestamp.
        - Cliente debe compensar el _offset_ y _delay_.

- NTP
    - Network Time Protocol

- Ambientes inalambricos:
    - Requieren algoritmos diferentes
    - Ejemplo: Reference Broadcast Synchronization

## Relojes lógicos

- Generalmente lo que importa es que los nodos esten de acuerdo en el _orden_ de los eventos.

- Relación _happened-before_:
    - $a$ y $b$ son eventos
    - Si $a$ ocurre antes que $b$ en un mismo proceso, entonces $a \rightarrow b$
    - Si $a$ es el envío de un mensaje y $b$ la recepción, entonces $a \rightarrow b$
    - Transitivo: si $a \rightarrow b$ y $b \rightarrow c$, entonces $a \rightarrow c$
    - Introduce un **ordenamiento parcial** sobre los eventos.

- Diseño:
    - Cada evento $e$ tiene asociado un timestamp $C(e)$
    - Propiedad 1: si $a$ y $b$ son eventos en un mismo proceso y $a \rightarrow b$ entonces $C(a) < C(b)$
    - Propiedad 2: si $a$ y $b$ son envío y recepción de un mensaje respectivamente, entonces $C(a) < C(b)$

- Implementación:
    - Cada proceso $P_i$ mantiene un reloj lógico $C_i$
    - Por cada evento en $P_i$, $C_i = C_i + 1$
    - Cada mensaje enviado por _Pi_ tiene un timestamp _ts(m)_ = _C(i)_ 
    - Cuando _Pj_ recibe un mensaje _m_:
        - Ajusta su contador _Cj_ con el máximo valor entre _Cj_ y _ts(m)_
        - Antes de pasar el mensaje a la aplicación, incrementa _Cj_ en uno.

- El servicio de relojes lógicos es implementado en un middleware, idealmente la aplicación no tiene por que ocuparse.

- Ejemplo de uso: multicast totalmente ordenado

## Relojes vectoriales

Al usar relojes lógicos si $C(a) < C(b)$ no implica que $a$ ocurra antes que $b$

Solución: relojes vectoriales

- Cada nodo mantiene su propio reloj lógico
- Mantiene información de los relojes lógicos del resto de los nodos
- Se organizan como un vector o arreglo
    - $V[i]$ es el reloj lógico del nodo $i$
    - $V[j]$ es el reloj lógico del nodo $j$

Ahora el timestamp asociado a cada mensaje es un vector: _ts(m)_ = _VC_

Para comparar dos relojes vectoriales, _VCa_ < _VCb_ si y solo si:

- _VCa[k]_ <= _VCb[k]_ para cualquier _k_
- existe al menos un k' tal que _VCa[k']_ < _VCb[k']_

Si se cumple _VCa_ < _VCb_ entonces un evento precede causalmente a otro.

Implementación: similar al reloj lógico

Ejemplo de uso: multicast totalmente ordenado.

## Exclusión mutua

- Coordinar el acceso exclusivo a un recurso.

- Estrategias:
    - Mediante permisos: acuerdo entre los procesos.
    - Utilizando un token: quien tiene el token, accede al recurso.

### Centralizado

- Uso de un coordinador que otorga el acceso al recurso
- Facil de implementar, sencillo de mantener. 
- Posibles problemas para escalar.

### Descentralizado

- Recurso con N replicas, cada una con un coordinador asignado.
- Acceder al recurso requiere votos positivos de al menos m > N/2 coordinadores.

### Distribuido

- Uso de multicast totalmente ordenado para coordinar el acceso.
- Requiere poder contactar a todos los procesos interesados en el mismo recurso.

### Token ring

- Procesos organizados en un anillo lógico.
- Token circula por el anillo.
- Quien tiene el token puede acceder al recurso.

### Comparación:

- Centralizado:
    - Requiere 3 mensajes para acceder/liberar el recurso (petición, recepción del ok, liberación).
- Distribuido:
    - Si existen _N_ nodos, debo envíar mensajes a cada uno y esperar confirmación de ok: _2(N-1)_ mensajes.
- Token-ring:
    - El token puede recorrer indefinidamente el anillo hasta ser retenido para el acceso al recurso.
    - En el peor caso un nodo debe esperar _N-1_ mensajes hasta que le llegue el token (suponiendo un anillo de _N_ nodos)

### Ejemplo: exclusion mutua con Zookeeper

- En la práctica muchos sistemas distribuidos utilizan un coordinador centralizado
- Zookeeper ofrece servicios para:
    - exclusion mutua
    - elección de lider
    - monitoreo
    - etc
- Diseñado para ofrecer confiabilidad, tolerancia a fallas y escalabilidad
    - Aunque es logicamente un servicio centralizado, su implementación es un sistema distribuido
- Usar zookeeper o servicios similares: ¡no hay que reinventar la rueda! (sobre todo una rueda complicada)

- Zookeeper 101:
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

- Ejemplo: obtener acceso exclusivo
    - Un proceso crea un nodo, por ejemplo con nombre `/lock`
    - Si existe, la operación falla indicando que ya existe
    - El proceso debe repetir la operación para obtenerlo
    - En caso de crearlo, para liberar el acceso elimina el nodo `/lock`
    - Problemas:
        - ¿que sucede cuando un cliente crea `/lock` y desaparece?
        - Proceso p2 puede solicitar notificaciones por `/lock` mientras `/lock` es eliminado
        - Estas sutilezas y muchas más son manejadas por zookeeper.

## Algoritmos de elección

- Muchos algoritmos distribuidos requieren que un nodo actue como coordinador.
- No importa en general cual nodo en particular sea el coordinador... pero alguien tiene que hacerlo.
- Mediante un algoritmo de elección se escoje un nodo para que actue como coordinador.

- En general se asume:
    - Cada proceso *P* cuenta con un identificador único *id(P)*.
    - Cada proceso conoce a todo el conjunto de procesos (aunque no cuales estan funcionando).

- El objetivo de estos algoritmos es que cuando finalice la elección *todos* los procesos hayan acordado el mismo lider.

### Algoritmo del matón (*bully*)

- Considerar *N* procesos, cada uno con un identificador *k*, con *k* entre 0 y n-1.
- Cuando un proceso *k* se da cuenta que el lider no responde:
    - Envía un mensaje ELECTION a todos los nodos con identificador > k.
    - Si ninguno responde, el nodo *k* asume el papel de líder.
    - Si alguno responde con OK, toma el control del proceso de elección y *k* desiste.
    - Eventualmente, sólo un proceso tomará el control, enviando el mensaje COORDINATOR.
- Si un proceso caído retoma su ejecución, inicia una elección.
- Como el proceso con mayor ID es el que gana, se lo conoce por el nombre de "bully algorithm".

### Elección en un anillo

- Suponer que cada nodo conoce su sucesor, y al siguiente a este, y al proximo, y así.

- Cuando un nodo detecta que el coordinador no responde:
    - Envía un mensaje ELECTION a su sucesor (o al siguiente si este no responde), con su ID.
    - El receptor reenvia el mensaje ELECTION, agregando su propio ID.
    - Eventualmente, el mensaje retorna al emisor original.
    - En ese momento, el mensaje circula nuevamente ahora con el tipo COORDINATOR.
    - El mensaje contiene ahora: el nuevo coordinador (el ID mas alto) y que nodos estan activos en el anillo.

- ¿Importa que dos o más procesos inicien una elección?
    - No, únicamente habrá mayor recarga en la red.

## Elecciones en sistemas de gran escala

Muchos algoritmos de elección suponen un número pequeño de nodos.

Las cosas se vuelven complicadas a medida que el número de nodos aumenta.

Un ejemplo es una red _blockchain_.

### Proof of work

Consiste en que los nodos compitan en base a su **poder de cómputo**

Para esto, compiten para ver quien es el primero en resolver un problema complejo pero soluble.

El ganador es el nodo que primero difunde una solución.

El nodo ganador se convierte en el líder: es quien añade la transacción a la cadena de bloques.

Multiples problemas: 

- Principalmente, consumo de energía.
- ¿Cómo regular la complejidad del problema?

### Proof of stake

## Elecciones en redes inalambricas

En una red inalambrica, la transmisión no es necesariamente confiable, ni la topología permanece estática.

El algoritmo presentado por Vasudevan escoge el _mejor_ líder.

Para elegir un líder un nodo difunde un mensaje _ELECTION_ a sus vecinos.

Si un nodo vecino hubiera recibido ya un mensaje _ELECTION_, simplemente retorna un _ACK_.

Caso contrario, si recibe un mensaje _ELECTION_ por primera vez recuerda al nodo emisor y retrasmite el mensaje.

En cuanto todos los nodos vecinos responda a esta retransmisión de _ELECTION_, el nodo responde al emisor original.

## Coordinación basada en rumores

Se puede utilizar rumores para recolectar información.

Consensuar un mismo valor:

- Cada nodo $P_i$ escoge un valor arbitrario $v_i$
- Cuando dos nodos $P_i$ y $P_j$ intercambian datos: $v_i, v_j \leftarrow (v_i + v_j)/2$
- Eventualmente todos los nodos tendran el mismo valor (media de los valores iniciales)

Estimar el número de nodos:

- El nodo $P_1$ escoge $v_1=1$, el resto de los nodos $v_i=0$
- Si hay $N$ nodos, eventualmente todos tendran $v_i=1/N$
- Se puede estimar el tamaño de la red como $1/v_i$

Seleccionar un nodo al azar:

- Cada nodo $P_i$ seleccionar un valor $m_i$ al azar y setea $v_i=m_i$
- Al intercambiar datos $P_i$ y $P_j$ realizan $v_i, v_j \leftarrow max\{v_i, v_j\}$
- Si luego $m_i < v_i$, entonces el nodo $P_i$ _pierde_ la competencia.
- Eventualmente un único nodo será el ganador.

Aplicacion

- Un nodo al azar inicia el proceso de estimación de números de nodos.
- Si el numero de nodos es estable, se puede designar un nodo fijo para que realice el conteo.
- Caso contrario, se pueden utilizar _epocas_ o bien un nodo al azar cada tanto realiza un conteo.

## Peer-sampling

¿Cómo elegir un nodo al azar cuando no se conoce la totalidad de los nodos en el sistema?

Un nodo podría tener toda la información, pero no es una solución escalable.

Una solución es el uso de _vistas parciales_:

- Cada nodo mantiene una lista de _c_ nodos vecinos.
- Los nodos intercambian parte de sus listas parciales con otros nodos (en su vista parcial).
- Cada nodo actualiza su vista parcial, pero siempre manteniendo _c_ nodos en la misma.

Si esto se repite regularmente, escoger un nodo al azar de la vista parcial es **estadisticamente indistinguible** de hacerlo de la totalidad de los nodos.

## Construccion de redes superpuestas

Es posible utilizar las _vistas parciales_ para generar _topologías estructuradas_.

Un posible protocolo para lograrlo estaría dividido en dos capas:

- Una capa inferior que mantiene la _vista parcial_ y opera sobre la red no-estructurada.
- Una capa superior que genera una topología estructurada en base a la _vista parcial_.

## Rumores seguros

La velocidad de propagación de datos puede generar problemas de seguridad/confiabilidad.

Por ejemplo, $c$ nodos pueden cooperar maliciosamente para cooptar la red:

- Al intercambiar las vistas parciales, estos nodos envian $c/2$ entradas que sólo referencian a alguno de estos $c$ nodos.
- Gradualmente, las vistas parciales de _todos_ los nodos solo contienen referencias a un conjunto de estos $c$ nodos.

Se busca tratar de detectar y prevenir comportamiento malicioso

Los nodos maliciosos pueden ser detectados por el elevado número de referencias desde otros nodos (_indegree_)

Sin embargo, al detectarlos ya puede ser demasiado tarde

Una manera de mitigar es requerir que los nodos generen estadísticas:

- Al intercambiar vistas parciales se puede realizar también estadísticas
- Es importante que no se sepa cuando se utilizan para actualizar la vista parcial o para generar estadísticas
- Un nodo malicioso no puede devolver siempre enlaces a otros nodos maliciosos, sería rápidamente descubierto
- No queda otra que, de vez en cuando, "jugar con las reglas" de los nodos benignos





