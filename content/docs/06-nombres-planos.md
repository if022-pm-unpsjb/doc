+++
title = 'Nombres planos'
date = 2024-09-18T23:06:02-03:00
draft = false
weight = 610
+++

# Nombres planos

No contienen información acerca de la entidad, su ubicación o su punto de acceso.

En general los **identificadores** son de este tipo.

Ejemplo:

- `0b0adad386f3f0836c994e8487c1b470cbb6f682` (suerte con intentar conocer la entidad sin contexto)

- `00:26:c7:d9:98:54`

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

- Cada nodo chequea si contiene la entidad asociada al identificador recibido.

- Ejemplo: [ARP](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)

**Problema**: a medida que la red incrementa su tamaño, el uso de broadcast se vuelve ineficiente.

## Multicast

El objetivo es evitar interrumpir nodos que no esten interesados en el mensaje.

- Posible de implementar en redes [Ethernet](https://en.wikipedia.org/wiki/Multicast#Ethernet)

- En IP se puede definir [grupos de multicasting](https://en.wikipedia.org/wiki/IP_multicast)
    - Cada grupo es identificado mediante una dirección.

- Útil como mecanismo de ubicación
    - El multicast puede ser una consulta por la dirección de un nodo en particular.

- Otro uso es enviar una petición a múltiples replicas.

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

    - [RFC 5944](https://datatracker.ietf.org/doc/rfc5944/) - IP Mobility Support for IPv4, Revised 
    - [RFC 6275](https://datatracker.ietf.org/doc/rfc6275/) - Mobility Support in IPv6 

- Es un estándar de la [IETF](https://ietf.org/) que permite a un dispositivo móvil mantener una dirección IP permanente.

- Intenta ofrecer un elevado nivel de transparencia de ubicación.

- Funcionamiento:
    
    - Cada nodo móvil tiene una IP fija.

    - La comunicación inicial con el nodo móvil se realiza mediante el *home agent* (vendría ser el **hogar**)

        - El *home agent* reside en la red origen, por lo general donde se generó el nodo móvil

    - Cuando el nodo se muda a otra red, solicita allí una nueva IP que registra en el *home agent*

        - Esta dirección se conoce como _care-of address_

    - Cuando el *home agent* recibe una consulta para el nodo, se la reenvía.

        - Puede usar por ejemplo, [tunneling](https://www.cloudflare.com/learning/network-layer/what-is-tunneling/)

    - Al mismo tiempo, el emisor de la consulta recibe del *home agent* la ubicación actual del nodo móvil.

    - El nodo móvil, luego se comunica directamente con el emisor de la consulta.

    - Este proceso se oculta en lo posible a la aplicación.

![06-01.png](/06-01.png)
