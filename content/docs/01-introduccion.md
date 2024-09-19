+++
title = 'Introducción a los Sistemas Distribuidos'
date = 2024-09-18T22:59:19-03:00
draft = false
weight = 100
+++

# Introducción

_the #1 rule of distribute computing: Don’t distribute your computing! At least if you can in any way avoid it_

_You're not Google. Your company will never be Google... Is there a reason we can't just do this all in Postgres?_

Avances imporantes han ocurrido en las últimas décadas:

- Desarrollo de microprocesadores potentes, pequeños y ecónomicos.
- Avance de las tecnologías de comunicaciones.
- Miniaturización de los sistemas de cómputo (ES, IoT, SoCs, etc).

En la actualidad es _relativamente sencillo_ desarrollar un sistema compuesto de múltiples computadoras conectadas por una red.

Al estar las computadoras físicamente separadas se habla de un **sistema distribuido**.

## Definición

_You know you have a distributed system when the crash of a computer you have never heard of stops you from getting any work done._ -- [Leslie Lamport](https://en.wikipedia.org/wiki/Leslie_Lamport)

_Una colección de elementos computacionales autónomos que dan la apariencia a sus usuarios de ser un sistema coherente_ -- [Tanenbaum y Van Steen](https://www.distributed-systems.net/)

Aunque no existe una definición ampliamente aceptada por toda la disciplina, la distribución de los componentes en diferentes sistemas comunicados mediante una red es una característica común.

### Caracteristica 1: elementos independientes

- Nodos independientes que colaboran para alcanzar un objetivo común.
- Los nodos son heterogéneos.
- La comunicación entre los nodos se realiza mediante paso de mensajes.
- No se existe un _reloj global_ (dificulta la sincronización y coordinación).
- La concurrencia y el paralelismo es natural.
- Organizado como una red superpuesta, estructurada o no-estructurada (ej: sistemas p2p).
- Fallas parciales (independientes).
- Se tiene que resolver cuestiones de organización y membresía (grupos cerrados, abiertos).

### Caracteristica 2: sistema coherente

- El sistema se comporta de acuerdo a las expectativas de sus usuarios.
- Transparencia de distribución: no importa como, cuando ni donde se conecte al sistema, el usuario debe tener el mismos servicio.
- Sin embargo, no es posible (ni deseable) ocultar todos los detalles de la distribución del sistema.
- Fundamental poder lidiar con fallas parciales.

### Distribuido vs Descentralizado

- Conceptos relacionados
- Sistema distribuido: componentes colaboran para realizar una tarea o proveer un servicio.
- Sistema descentralizado: componentes con mayor autonomía sin único punto de control.
- Un sistema distribuido puede estar _logicamente centralizado_: DNS.
- Un sistema descentralizado no tiene una autoridad central: blockchain (ej. Bitcoin)

- Otra vision es la siguiente:
    - Sistema _integrativo_ (conectar sistemas existentes formando así uno nuevo) 
    - Sistema _expansivo_ (agregar nodos a un sistema existente).

- Luego:
    - _Sistema descentralizado_: visión _integrativa_, los recursos se encuentran _necesariamente_ dispersos.
    - _Sistema distribuido_: visión _expansiva_, los recursos se encuentran _suficientemente_ dispersos.

### Complejidad

- Los sistemas distribuidos son inherentemente complejos.
- Los sistemas centralizados son más sencillos.
- La distribución no es un fin en sí mismo: considerar soluciones lo más simples posibles.

## Middleware

Los componentes y funciones comunmente usados en un sistema distribuido se agrupan en un middleware, una capa de software entre el sistema operativo y las aplicaciones que intenta abstraer los detalles escabrosos y ofrecer una interfaz más amigable.

Por ejemplo, un middleware ofrece:

- Comunicación (RPC, RMI, paso de mensajes, etc.)
- Manejo de transacciones.
- Composición de servicios.
- Confiabilidad.

## Objetivos de diseño

- Sólo por que sea posible no quiere decir que diseñar un sistema distribuido sea siempre una buena idea.

- Un sistema distribuido debe poder satisfacer alguno de los siguientes objetivos, para que su implementación valga la pena:

    - Permitir que los recursos sean más fácilmente accesibles.
    - Ocultar en lo posible que los recursos están desperdigados (transparencia de distribución).
    - Debe ser _abierto_.
    - Debe poder ser escalable.

### Compartir recursos

- Por cuestiones económicas.
- Mejorar la colaboración.
- Ejemplo clásico: p2p

### Transparencia de distribución

Un sistema distribuido debe (en lo posible) ocultar que los procesos y recursos estan fisicamente distribuidos: esto se conoce como _transparencia de distribución_.

Diversos tipos:

- *Acceso*: ocultar cómo se accede al recurso y la representación de datos.
- *Ubicación*: ocultar la ubicación de un recurso.
- *Reubicación*: ocultar el hecho de que el recurso pueda cambiar su ubicación mientras esta en uso.
- *Migración*: ocultar el hecho de que un recurso cambie su ubicación.
- *Replicación*: ocultar el hecho de que existan múltiples copias de un mismo recurso.
- *Concurrencia*: ocultar el hecho de que un recurso pueda ser accedido por múltiples usuarios.
- *Falla*: ocultar la falla y recuperación de un recurso u objeto.

No siempre es deseable o _posible_ alcanzar el máximo grado de transparencia.

- Es imposible ocultar las latencias de una red WAN u ocultar la falla de un nodo. 
- Compromiso entre el nivel de transparencia y perfomance: 
    - Mantener las replicas consistentes incurre en un costo temporal que no se puede ocultar.
- Se puede argumentar que es mejor exponer la distribución al usuario, en lugar de ocultarla.

### Abierto

Poder interactuar con otros sistemas. Requiere interfaces bien definidas.

Un sistema abierto es aquel que permite que sus componentes sean utilizados en otros sistemas. También generalmente un sistema abierto esta compuesto por componentes de otros sistemas. Beneficia la interoperabilidad, portabilidad, _composibility_ y extensibilidad. Una característica importante para lograr este objetivo es la de separar política de mecanismo, evitando soluciones monolíticas.

### Escalabilidad

La escalabilidad abarca tres dimensiones:

- Tamaño: la facilidad con que se pueden sumar usuarios o recursos.

    - Generalmente relacionado con limites en capacidad de cómputo, almacenamiento y ancho de banda.
    - Pueden ser formalmente analizados mediante teoría de colas.

- Geografía: los recursos y usuarios pueden estar desperdigados pero las latencias no afectan seriamente al sistema.

    - El principal problema es la comunicación sincrónica sobre enlaces con alta latencia.
    - Las WANs ofrecen menor confiabilidad que una LAN, menor capacidad de ancho de banda.
    - ¿Multicast / Broadcast? Posible en LANs, no tan así en WANs.

- Administrativa: el sistema abarca distintas unidades organizacionales pero aún así es fácilmente administrable.

    - Cómo resolver conflictos de políticas acerca de uso, pago, administración, seguridad, etc.

Ejemplos:

- Tamaño: incrementar fácilmente el número de usuarios o procesos.
- Geografía: poder aumentar la distancia entre nodos.
- Administrativo: integrar recursos de otra organización.

Soluciones:

- *Escalar verticalmente*: simplemente incrementar la capacidad del servicio (computo, almacenamiento o ancho de banda).
- *Escalar horizontalmente*:
    - Ocultar latencias: comunicación asíncrona, fat-clients, etc.
    - Distribuir el trabajo: dividir un componente y dispersarlo por el sistema.
        - Ej: mover computo al cliente (Java Applet), descentralizar un servicio (DNS), descentralizar contenido (WWW), etc.
    - Replicar: contar con una copia cercana, cache, etc.
        - _Problemas de consistencia_.
        - Consistencia estricta requiere sincronización global (costoso, reduce escalabilidad).

## Tipos de sistemas distribuidos

A grandes rasgos, podemos clasificar los sistemas distribuidos en sistemas distribuidos de cómputo, de información y pervasivos.

- Cómputo:
    - Cluster: conjunto de sistemas interconectados por una red de alta velocidad.
    - Grid: nodos dispersos, heterogéneos, diferentes organizaciones.
    - Cloud: software/infraestructura como servicio.
    - Edge
- Información:
    - Integración de sistemas de información ya existentes; ofrecer servicios como transacciones distribuidas.
- Pervasiva:
    - Sistemas móviles, embebidos, IoT. No existe una topología estática, ni conexión permanente, etc.
    - Tres tipos: ubicuos, móviles y redes de sensores (los límites entre la categorías son difusos).

## Falacias

Desarrollar un (buen) sistema distribuido es una tarea ardua. Las siguientes falsas presunciones durante el diseño del sistema, traen como consecuencia complejidad innecesaria y errores:

- La red es confiable.
- La red es segura.
- La red es homogenea.
- La topología no cambia.
- La latencia es cero.
- El ancho de banda es infinito.
- El costo del transporte es cero.
- Sólo existe un administrador.

Algunas más:
- Un sistema centralizado no escala:
    - Un sistema físicamente centralizado quizá no, pero uno _lógicamente_ centralizado sí (ejemplo DNS).
- Un sistema centralizado tiene un unico punto de falla:
    - Si, pero un solo punto de falla es más fácil de administrar, más fácil de arreglar.
    - Soluciones: en el caso de DNS, cada _root server_ es a su vez un cluster.

## ¿Que vamos a estudiar?

- Arquitectura: ¿Como organizar el sistema?
- Procesos: ¿Procesos, hilos?
- Comunicacion: ¿Como comunicar entre los nodos?
- Coordinación: ¿Cómo coordinar acciones? ¿Y cómo hacerlo de una manera independiente de la aplicación?
- Nombres: ¿Cómo identificar los diferentes recursos?
- Consistencia y replicación: Si se replica, ¿como se maneja la consistencia?
- Tolerancia a fallas: como mantener el sistema funcionando ante la falla de un componente.
- Seguridad: asegurar acceso autorizado a los recursos.

