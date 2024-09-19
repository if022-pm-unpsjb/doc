+++
title = 'Nombres planos'
date = 2024-09-18T23:06:02-03:00
draft = true
+++

No contienen ningún tipo de información acerca de la entidad ni de su punto de acceso.

Ejemplo: una dirección representada como una cadena aleatoria de bits.

¿Cómo se puede resolver la entidad asociada?

## Broadcast

Para resolver un nombre plano se realiza un broadcast del identificador.

- Una red LAN (cableada o wireless) ofrece servicios eficientes de broadcast.

- Cada máquina chequea si contiene la entidad asociada al identificador.

- Ejemplo: [ARP](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)

A medida que la red incrementa su tamaño, el uso de broadcast se vuelve ineficiente.

Alternativa: **multicasting**

- Evita interrumpir nodos que no esten interesados en el mensaje.

- Posible de implementar en redes [Ethernet](https://en.wikipedia.org/wiki/Multicast#Ethernet)

- En IP se puede definir [grupos de multicasting](https://en.wikipedia.org/wiki/Multicast#IP), identificados mediante una dirección.

- Útil como mecanismo de ubicación

- Se puede utilizar para enviar la petición a múltiples replicas.

## Forwarding Pointers

Mantener una referencia a la nueva ubicación una entidad.

Ejemplo: si una entidad se mueve de A a B, entonces en A queda una referencia a B.

Es sencillo, basta seguir la cadena de referencias para ubicar la entidad.

Desventajas:

- La cadena de referencias puede terminar siendo demasiado extensa.

- Las ubicaciones intermedias deben preservar la referencia.

- La cadena de referencias es vulnerable a la pérdida de alguno de sus componentes.

## Basados en hogar (home-based)

Consiste en mantener una referencia a la ubicación actual de una entidad.

- La referencia se mantiene en una entidad conocida como **home location**

- Utilizado para referir entidades móbiles en redes de gran escala

- Mecanismo de respaldo para servicios basados en [forwarding pointers](#forwarding-pointers)

Ejemplo: [Mobile IP](https://en.wikipedia.org/wiki/Mobile_IP)

- Ofrece un elevado nivel de trasnparencia de ubicación.

- Funcionamiento:
    
    - Cada nodo móvil tiene una IP fija.

    - La comunicación inicial con el nodo móvil se realiza con el *home agent*

    - El *home agent* reside en la red inicial

    - Cuando el nodo se mueve a otra red, solicita una nueva IP que es registrada en el *home agent*

    - Cuando el *home agent* recibe un request para el nodo, reenvia el paquete al nodo.

    - El emisor es informado por el *home agent* de la ubicación del nodo móvil.

    - Este proceso se oculta en lo posible a la aplicación.

- Desventajas:
    
    - Incremento de latencia.

    - La ubicación hogar _siempre_ tiene que existir.

<img src="06-01.png" height="50%">

