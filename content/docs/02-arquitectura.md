+++
title = 'Arquitecturas'
date = 2024-09-18T23:02:19-03:00
draft = false
weight = 200
+++

# Arquitecturas

Es fundamental una correcta organización para administrar la complejidad de un sistema distribuido.

Podemos diferenciar:
- La organización de los componentes de software (_arquitectura de software_).
- Cómo están físicamente instanciados (_arquitectura del sistema_).

## Estilo arquitectonico

Organización lógica de los componentes de software del sistema:

- Componentes.
    - Unidad modular con interfaces bien definidas (reemplazable).
- Cómo se conectan y comunican.
    - Conector: el mecanismo que media la comunicación entre los componentes.
- Qué datos intercambian.
- Cómo están configurados.

Según como se configuran componentes y conectores, tenemos una _arquitectura de software_.

Arquitecturas tipicamente utilizadas en sistemas distribuidos son:

- Arquitecturas por capas.
- Orientadas a los servicios.
- Publish-subscribe.

### Arquitectura por capas

Los componentes se organizan en capas. Un componente en la capa N invoca generalmente los servicios de un componente en la capa N-1. Excepcionalmente, un componente puede invocar un servicio de una capa superior (N+1).

Ejemplo clásico: protocolos de comunicación de redes (TCP/IP, OSI, etc).

Muchas aplicaciones se organizan en capas siguiendo el siguiente estilo:

- Capa de presentación o interfaz de usuario.
- Capa de procesamiento o de negocio.
- Capa de datos o persistencia.

Desventaja:
- Existe una dependencia fuerte entre las distintas capas.

### Orientadas a los servicios

Organización más imprecisa, donde cada componente encapsula un servicio. El sistema se estructura como una _composición_ de servicios.

- Orientado a objetos (invocación de objetos remotos).
- Microservicios (cada componente representa un servicio separado e independiente).
- Basada en recursos (REST).

- Objetos:
    - Cada componente corresponde con objeto.
    - Se comunican mediante algún mecanismo de invocación.
    - Encapsular datos y procedimientos dentro del objeto, ofreciendo una interface.
    - Los objetos pueden estar distribuidos.

- Microservicios:
    - Mas info: https://microservices.io/
    - "same crap, but distributed"
    - the biggest issue with microservices is that they convert nice errors with a stack trace to network errors

- SOA:
    - La aplicación es una composición de servicios.
    - Estos pueden pertenecer a diferentes organizaciones administrativas.
    - Ej: procesador de pagos.

- Basados en recursos:
    - En lugar de servicios, se consideran recursos.
    - Popular por su simplicidad.

### Publish-subscribe

Separación de procesamiento y coordinación (comunicación y cooperación).

El sistema es visto como un conjunto de componentes autónomos.

Lograr que los componentes no tengan dependencias explicitas.

Los componentes describen los eventos que le son de interés.

- Event-based
    - Referencialmente desacoplados
    - Temporalmente acoplados

- Space-based 
    - Referencial y temporalmente desacoplados.
    - Comunicación mediante tuplas
    - Procesos ingresan tuplas en un espacio compartido.
    - Recuperación mediante búsqueda

Ambos tipos se pueden combinar (generar evento cuando tuplas de interés son ingresadas al espacio de intercambio)

En este caso, hablamos de publicación - subscripción.

    - Se deben describir los eventos de interes.
    - Generalmente como (atributo, valor) o (atributo, rango)
    

## El middleware

Facilita el desarrollo de un sistema distribuido. Es una capa que administra recursos y ofrece servicios comunes. 

El principal objetivo es ayudar en la transparencia de distribución.

Por ejemplo, se puede encargar de:

- Acceso a recursos remotos.
- Ofrecer servicios para la comunicación entre componentes.
- Servicios de seguridad y administración.
- Recuperación de fallas.
- Coordinación.
- Etc.

Algunos ejemplos concretos en sistemas distribuidos:

- Servicio de Mensajería: RabbitMQ, ZeroMQ,
- Llamadas a procedimientos remotos: RPC, RMI, gRPC
- Objetos distribuidos: CORBA
- Streaming de datos y eventos: Apache Kafka
- Monitores de transacciones distribuidas

El middleware se puede organizar de varias maneras. Por ejemplo:

- _Wrappers_: por aplicación o centralizado.
- _Interceptores_: Permite ejecutar código adicional durante la ejecución de un servicio.

## Arquitectura del sistema

Ubicación e interaccion de los componentes software junto con el hardware.

Pensar en clientes que piden servicios a servidores ayuda con la complejidad de los sistemas distribuidos.

## Arquitectura en capas

Cliente-servidor: 

- Modelo más sencillo
- Procesos divididos en dos grupos: *clientes* que invocan un servicio implementado en *servidores*
- La invocacion puede usar una conexión no confiable (quiza usando operaciones _idempotentes_) o confiable (TCP, cuando la red no es fiable).
- No siempre se puede definir de manera precisa la separación entre cliente y servidor. Puede variar.

Existen múltiples alternativas de como distribuir tres capas lógicas en un modelo cliente-servidor.

- Dos capas (two-tier)
- Multicapa: distribuir las capas en múltiples máquinas, por ejemplo una arquitectura de 3-capas.

*Distribución vertical*: componentes lógicos separados en máquinas separadas.

## Arquitecturas simétricas

*Distribución horizontal*: dividir cada componente lógico (servidor, cliente).

*peer to peer* (*p2p*): las funcionalidades del sistema están presentes en todos los procesos que constituyen el sistema. Un nodo puede actuar tanto como cliente o como servidor. La arquitectura del sistema toma la forma de una red sobrepuesta, que puede ser estructurada o no.

### p2p estructurados

Los nodos se organizan según alguna topología concreta: anillo, árbol, matriz, etc. En general cada nodo es responsable de mantener un cierto conjunto de datos, identificados mediante un identificador (generalmente, una función hash de los datos). Así, la red p2p es básicamente un tabla hash distribuida. La topología define como debe realizarse el ruteo de una consulta al nodo correspondiente.

Ejemplo: chord

### p2p no estructurados

No existe una topología predefinida y cada nodo mantiene una lista ad-hoc de nodos vecinos, lo que da como resultado un grafo aleatorio. Al momento de unirse, un nodo contacta un nodo bien conocido para obtener una lista inicial de vecinos. La búsqueda de datos requiere técnicas como inundación o _random walks_.

- Inundación: se pasa la búsqueda a todos los nodos vecinos. Un nodo ignora una búsqueda que ya recibió. Puede responder al nodo que originó la búsqueda o al que se la reenvió. La búsqueda tiene un TTL asociado. TTL igual a 1 para buscar entre nodos vecinos.

- Aleatorio: se pregunto a un nodo vecino al azar. Si no tiene el dato, este repite el procedimiento. Menor trafico, mayor tiempo de búsqueda. Se puede paralelizar y también tiene un TTL asociado.

- Por política: mantener una lista de nodos que han respondido peticiones, etc.

### p2p jerárquicos

Para aliviar problemas de escalabilidad, un p2p no-estructurado puede tener nodos especiales que mantengan un índice de items o datos, conocidos como "super pares".

- Nodo "weak" se conecta a la red a travez de un super-par. Puede ser siempre el mismo o no.
- Para mejorar confiabilidad, puede requerirse conectarse a n > 1 superpares.
- Los nodos superpares se organizan en una red p2p propia (de ahí la jerarquía)
- Problemas: ¿Cómo elegir que nodo superpar utilizar? ¿Cómo elegir cuales seran superpares? Elección de lider.

Ejemplo: bittorrent, CDN.

## Arquitecturas híbridas

En la práctica, un sistema complejo abarca múltiples arquitecturas.

### Cloud computing

Permite el acceso a un conjunto de recursos _virtualizados_ de fácil acceso. Cúantos de estos recursos son necesarios y cómo serán usados, es definido dinámicamente: por ejemplo, si un cliente requiere más poder de cómputo, simplemente puede pedir procesador virtuales adicionales. Básicamente, una nube se organiza en cuatro capas:

- Hardware: la capa más baja, que los clientes generalmente no ven, organizada en data-centers.
- Infraestructura: una capa de virtualización sobre los recursos de hardware, para ofrecerlos a los clientes.
- Plataforma: provee una capa de abstracción para la ejecución de aplicaciones y/o administración de recursos como almacenamiento.
- Aplicación: aplicaciones que pueden ser adaptadas por los clientes, como suites ofimáticas.

Estas capas son accesibles mediante una multitud de interfaces (web-services, APIs, etc).

A su vez, da lugar a tres capas de servicios diferenciados:

- IasS (Infraestructure-as-a-service)
- PaaS (Platform-as-a-service)
- SaaS (Software-as-a-service)
- FaaS (Function-as-a-service): ejemplo AWS Lambda.

El uso de un servicio en la nube tiene similitudes con la arquitectura cliente-servidor. Sin embargo, el servidor es totalmente opaco al cliente: no se sabe donde ejecuta, como esta implementado, etc.

### Edge computing

Como colocar los recursos en el "límite" de la red, entre los dispositivos y la nube. Generalmente, en los ISPs. Complementa cloud para reducir la latencia y el uso de ancho de banda. También permite aumentar la confiabilidad, y puede ser necesario para cumplir con políticas de privacidad y seguridad. Aumenta la complejidad de la administración de la aplicación.

Ej: Akamai, Netflix CDN, IoT, etc.

Argumentos a favor de edge computing:

- Latencia y ancho de banda: aunque el ancho de banda se ha incrementado en los últimos años, contar con los recursos más cerca del usuario final permite mejores garantías acerca del ancho de banda negociado. En cambio, la latencia es un problemas más complicado y donde existe un límite físico. En este caso, la cercanía reduce la latencia.

- Confiabilidad: Existen ciertos casos donde se debe garantizar el funcionamiento aún ante falta de conectividad a la nube.

- Seguridad y privacidad: por razones politicas/regulatorias ciertos datos no pueden ser subidos a la nube.

Desafios en orquestación:

- Recursos: para garantizar la disponibilidad de recursos, ¿como deben ser asignados o provisionados?

- Ubicación: Dónde y cúando los recursos deben ser hechos disponibles.

- Selección: no necesariamente el nodo más cercano es el mejor.

### Blockchain apps

Una presunción en el diseño de estas aplicaciones es que ningún nodo es _confiable_. Las transacciones son registras por un gran número de nodos participantes. Entre todos los nodos se mantiene una sola cadena de transacciones validadas. Dado que cada bloque es inmutable, la estructura de datos es fácilmente replicable.

La diferencia fundamental entre múltiples implementaciones es cuales nodos se encargan de realizar las validaciones (esto es, agregar nuevos bloques a la cadena). Agregar un bloque es básicamente llegar a un consenso entre los distintos nodos con rol de validador. Los tipos de consenso pueden ser:

- Centralizado: posible, pero en contra del diseño del sistema.

- Distribuido: un grupo preseleccionado de nodos se encarga de este rol.
    - Los nodos llegan a un consenso, tolerando así participantes maliciosos.
    - Si hay n nodos validadores, se toleran hasta k <= (n - 1)/3 nodos maliciosos/defectuosos.
    - El problema es que en general n es un numero pequeño.

- Descentralizada: todos los nodos participantes llegan a un consenso.
    - Mediante consenso todos los nodos escogen un nodo que llevara adelante la validación.
    - Este validación puede ser premiada.
    - No todos los nodos desearan ser elegibles, principalmente por costo de la validación.

