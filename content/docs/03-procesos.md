+++
title = 'Procesos'
date = 2024-09-18T23:03:01-03:00
draft = true
weight = 300
+++

# Procesos

Hilos, virtualización, cliente/servidor, migración.

## Procesos

Un proceso ofrece mejor isolación entre tareas.

Sobre todo, la protección puede ser asegurada por el hardware.

## Hilos

Los hilos nos permiten mantener la idea de procesos secuenciales que se bloquean por E/S junto con concurrencia:

- Un mismo proceso puede tener multiples hilos, cada uno visto como un programa secuencial.
- Evita tener que lidiar con callbacks asincrónicos.

El uso de hilos provee un mejor nivel de granularidad para el desarrollo de aplicaciones distribuidas y provee un mejor nivel de performance. 

A diferencia de los procesos, los hilos no ofrecen _transparencia_ de concurrencia:

- Comparten el mismo segmento de memoria.
- Mayor dificultad al diseñar la aplicación.

Implementación:

- Nivel de usuario: creación/destrucción y cambio de contexto menos costoso; bloqueo de todo el proceso.
- Nivel de kernel: administración y sincronización ligeramente más costosa, pero sin bloqueo de todo el proceso.

En un sistema distribuido, el uso de hilos permite simplificar la comunicación entre nodos, al implementar esta funcionalidad en un hilo separado en el programa.

Ejemplo: 

- Un cliente multi-hilo permite ocultar latencias, mejorando así la transparencia de distribución.
- Un navegador web permite visualizar una página aún cuando no se haya descargado completamente.

La mayor ventaja se puede observar en la implementación de servidores concurrentes. 

Alternativas: 

- un solo hilo (secuencial)
- uso de máquinas de estado (más complejo).

## Virtualización

El software por lo general "sobrevive" al hardware. 

Mediante la virtualización es posible reemplazar una interface particular de un sistema (sea hardware o software) por otra implementación que copia exactamente su comportamiento.

¿Por qué es utilizada?

- Permitir que software ejecute en nuevas arquitecturas.
- Simplifica el soporte de aplicaciones del lado del servidor: no requiere mantener multiples máquinas fisicas.
- Portabilidad y flexibilidad: migración de maquinas virtuales enteras de cloud a edge, por ejemplo.
- Seguridad: aislar codigo en ejecucion a un entorno virtual.

### Tipo de virtualización

- Hardware: instrucciones hardware de la plataforma (privilegiadas y no-privilegiadas).
- Llamadas al sistema: ofrecidas por el sistema operativo.
- API: ofrecida por la aplicación/librería.

### Contenedores

Permitir que múltiples aplicaciones ejecuten de manera aislada, cada una con su propio ambiente de software (librerías, sistema operativo, etc).

### Uso de maquinas virtuales en ssdd

- En la computación en la nube, la virtualización es fundamental para ofrecer servicios IaaS (Infraestructure as-a service)

## Clientes

En un sistema distribuido, el software ejecutando en el cliente busca por lo general mejorar la *transparencia de distrbución*

- Acceso.
- Ubicación.
- Migración.
- Reubicación.
- Replicación.
- Falla.
- Concurrencia.

## Servidores

Un servidor implementa una serie de servicios que ejecuta a pedido de un cliente. El servidor espera por una petición, la procesa y retorna el resultado.

El servidor puede estar organizado como:

- Iterativo
- Concurrente

Los clientes se contactan con el servidor haciendo uso de un _endpoint_. Generalmente, una IP:PUERTO. Estos pueden ser bien conocidos o requerir un lookup previo por parte del cliente.

Según la información de estado que administre, un servidor puede ser:

- Sin estado: la información del cliente se descarta cuando finaliza la conexión / operación.
- Con estado: mantiene información persistente de sus clientes.

### Servidor de objetos

El servidor no ofrece una funcionalidad específica, en cambio esta es provista por los objetos que almacena.

### Cluster de servidores

#### Lan Cluster

Un conjunto de servidores interconectados por una red de alta velocidad.

- Organización general:
    - Primer capa: switch que redirecciona las peticiones
    - Segunda capa: conjunto de nodos que ejecutan la logica de negocio/servicio
    - Tercer capa: nodos que se encargan de persistencia de datos

- La redirección de peticiones puede realizarse en 
    - nivel de transporte (ej TCP)
    - nivel de aplicación (en base al contenido del request)

#### Wan Cluster

- Uso de DNS para el balanceo de carga o reducción de latencia.
- Ejemplo: Content Delivery Networks (CDNs) como Akamai

## Migración de código

### Razones

- Perfomance
    - Mover código/procesos a nodos con menor carga.
    - Actualmente se busca mover procesos de nodos con poca carga a otros con carga media/alta.
        - Estrategia de optimización de consumo de energía en datacenters.
    - Migración de VMs menos compleja (aunque requiere más recursos) que migración de procesos.
    - En un sistema distribuido puede importar más reducir latencias que mejorar perfomance de ejecución.
    - La heterogenidad de plataformas dificulta determinar ganancia de computo.

- Seguridad y privacidad
    - Mover el código/procesos a donde esten los datos por cuestiones de seguridad/privacidad de los mismos.
    - Por ejemplo, mover procesos para entrenar una red neuronal a los nodos con los datos, no al reves.

- Flexibilidad
    - Permitir reconfigurar dinámicamente un sistema distribuido.
    - Por ejemplo, descargar implementación de un protocolo dinámicamente para comunicación con un servidor.

### Modelos para migración de código

- Ademas de código, puede ser necesario mover datos y el contexto de ejecución (migración de procesos)
- Podemos identificar en un proceso: código, recursos y contexto de ejecución.
- La migración se puede clasificar como 
    - *sender-initiated*: ej, enviar un programa a un servidor para su ejecución 
    - *receiver-initiated*: recepcionar un codigo, ejemplo un applet o javascript
- Como resultado, tenemos cuatro modelos:
    - *Cliente-Servidor*: todo se ejecuta en el servidor, solo se envia un resultado.
    - *Evaluación Remota*: código migra al servidor, donde se ejecuta.
    - *Codigo a demanda*: código migra al cliente, donde se ejecuta.
    - *Agentes móbiles*: se migra código y contexto de ejecución.
- Se puede diferenciar tambien:
    - *Movilidad débil*: solo se migra código (requiere crear un nuevo ambiente de ejecución), modelo sencillo.
    - *Movilidad fuerte*: se migra código y ambiente de ejecución (ej, migración de un proceso en ejecución, o clonado).

![modelos-migracion-codigo](/03-28.png)

### Heterogeneidad

- Los sistemas distribuidos son heterogéneos
- No siempre se puede migrar código y ejecutarlo en el nodo receptor, por diferencias en arquitectura, software, etc.
- Solución: interpretes y/o máquinas virtuales
- Ejemplos de lenguajes: Python, Java, Pascal, Erlang/Elixir, etc.
- Migración de todo el entorno: VMs como Dropbox, VMWare, VirtualPC, etc.
