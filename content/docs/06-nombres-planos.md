+++
title = 'Nombres planos'
date = 2024-09-18T23:06:02-03:00
draft = false
weight = 610
+++

# Nombres planos

No contienen ningún tipo de información acerca de la entidad ni de su punto de acceso.

En general los identificadores son de este tipo.

Ejemplo:

- Una dirección representada como una cadena aleatoria de bits.

- `00:26:c7:d9:98:54` (suerte con intentar conocer la entidad solo leyendo esto)

Son sencillos de generar, pero transfieren la complejidad al mecanismo de resolución de nombres.

¿Cómo se puede resolver la entidad asociada?

Vamos a ver una serie de posibles soluciones simples:

- [Broadcast](#broadcast)
- [Multicast](#multicast)
- [Forwarding Pointers](#forwarding-pointers)
- [Basados en hogar](#basados-en-hogar-home-based)

## Broadcast

Una opción es realizar un _broadcast_ del identificador.

- Una red LAN (cableada o wireless) ofrece servicios eficientes de broadcast.

- Cada máquina chequea si contiene la entidad asociada al identificador.

- Ejemplo: [ARP](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)

A medida que la red incrementa su tamaño, el uso de broadcast se vuelve ineficiente.

## Multicast

El objetivo es evitar interrumpir nodos que no esten interesados en el mensaje.

- Posible de implementar en redes [Ethernet](https://en.wikipedia.org/wiki/Multicast#Ethernet)

- En IP se puede definir [grupos de multicasting](https://en.wikipedia.org/wiki/Multicast#IP), identificados mediante una dirección.

- Útil como mecanismo de ubicación

- Se puede utilizar para enviar la petición a múltiples replicas.

## Forwarding Pointers

Mantener una referencia a la nueva ubicación una entidad ([dio para una tesis](https://digital.lib.washington.edu/researchworks/items/10a1b19e-519e-4b4b-8840-3242bb8fe487))

Su ventaja es la sencillez: basta seguir la cadena de referencias para ubicar la entidad.

### Ejemplo

- Si una entidad se mueve de _A_ a _B_, entonces en _A_ queda una referencia a _B_.

- ¿Y si luego se mueve a _C_? Entonces $A \rightarrow B \rightarrow C$

- ¿Y si despues se mueve a _D_? Creo que se capta la idea...

### Desventajas

- La cadena de referencias puede terminar siendo demasiado extensa.

- Las ubicaciones intermedias deben preservar las referencias.

- La cadena es vulnerable a la pérdida de alguno de sus componentes.

Por lo tanto, es una solución principalmente aplicable en LANs.

## Basados en hogar (home-based)

Consiste en mantener una referencia a la ubicación actual de una entidad.

- La referencia se mantiene en una entidad conocida como **hogar** (**home location**)

- Por lo general, el hogar es donde se creo la entidad inicialmente.

### Desventajas
    
- Incremento de la latencia.

- El hogar _siempre_ tiene que existir.

### Aplicaciones

- Utilizado para referir entidades móviles en redes de gran escala

- Sirve como mecanismo de respaldo para servicios basados en [forwarding pointers](#forwarding-pointers)

### Ejemplo: Mobile IP

- [Mobile IP](https://en.wikipedia.org/wiki/Mobile_IP)

- Intenta ofrecer un elevado nivel de transparencia de ubicación.

- Funcionamiento:
    
    - Cada nodo móvil tiene una IP fija.

    - La comunicación inicial con el nodo móvil se realiza con un *home agent* (vendría ser el **hogar**)

    - El *home agent* reside en la red inicial, donde se generó el nodo 

    - Cuando el nodo se mueve a otra red, solicita allí una nueva IP que registra en el *home agent*

    - Cuando el *home agent* recibe una consulta para el nodo, la reenvía.

    - El emisor es informado por el *home agent* de la ubicación actual del nodo móvil.

    - Este proceso se oculta en lo posible a la aplicación.

![06-01.png](/06-01.png)
