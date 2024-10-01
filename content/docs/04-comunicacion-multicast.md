+++
title = 'Multicast'
date = 2024-09-18T23:04:03-03:00
draft = false
weight = 430 
+++

# Multicast

¿Cómo enviar datos a múltiples receptores?

Existen numerosas soluciones a nivel de protocoles de red y de transporte. Su principal desventaja es el costo en armar las rutas de difusión de datos.

A nivel de aplicación, las redes p2p estructuradas facilitan la creación de estas rutas de difusión. Veremos técnicas de difusión a este nivel.

## Basada en árboles

La idea básica es que los nodos estan organizados en una red superpuesta, utilizada para difundir los datos.

Las conexiónes lógicas pueden no ser óptima desde el punto de vista de los enlaces físicos.

Existen básicamente dos alternativas para la topología:

- Arbol: existe un único camino entre dos nodos cualesquiera de la red.
- Mesh: cada nodo tiene múltiples vecinos y por lo tanto requiere algún tipo de ruteo (existe más de un camino entre dos nodos cualesquiera)

Principal diferencia: mesh ofrece mayor tolerancia a fallos que árbol.

Principal desafío: ¿cómo construir la red superpuesta para la difusión?

Adicional: ¿cómo construimos un árbol de difusión *eficiente*?

La calidad del árbol para multidifusión se puede medir con tres métricas:

- Link stress: ¿cuántas veces debe un paquete atrevesar el mismo enlace?
- Link stretch: la razón entre el número de saltos en la red superpuesta y los enlaces físicos.
- Tree cost: métrica global, como reducir el costo agregado de los enlaces.

Situación: un nuevo nodo quiere sumarse a la red superpuesta.

- Se contacta con un nodo bien conocido.
- ¿Cómo decidir que nodo será su nodo padre en el árbol?
- Para evitar sobrecargar nodos, en general se pone un límite _k_ de nodos vecinos.
- Este límite dificulta establecer el árbol, ya que agregar un nodo puede requerir una reconfiguración.

## Inundación (flooding)

Para minimizar el número de nodos que reciben un mensaje del cual no son destinatarios, es mejor construir una red superpuesta con los nodos destino.

Ej: si en una topología de árbol un mensaje solo es para los nodos hoja.

Posible solución: diferentes redes superpuestas para cada grupo multicast. Desventaja: un nodo puede pertencer a varias redes superpuestas, lo que incrementa el costo de administración.

Una técnica sencilla de diseminar información a todos los nodos es la *inundación*:

- Enviar el mensaje a todos los nodos vecinos, excepto de quien lo recibió.
- Si se mantiene referencia de los mensajes enviados, se puede evitar duplicados.

Problema: ineficiente (gran cantidad de mensajes). Sólo sería eficiente si la red superpuesta fuera un árbol.

Se puede mejorar la situación utilizando *inundación probabilistica*:

- Un nodo reenviara el mensaje _m_ a un nodo vecino con una probabilidad _p_.
- El número total de mensajes decrece de manera lineal con _p_.
- Problema: A menor valor de _p_, más chances que existan nodos que no reciban el mensaje.
- Se puede entonces tener en cuenta también el número de nodos vecinos al momento de decidir si reenviar el mensaje o no.

¿Y si la red superpuesta tiene una topología estructurada? Las cosas se hacen más fáciles.

Ejemplo: hipercubo. Reenviar mensajes a nodos con una dimension superior. Total de mensajes: 2^n - 1.

Otro ejemplo: chord.

## Epidemico

Diseminar información siguiendo un comportamiento similar a los contagios de enfermedades. Como "infectar" rapidamente todos los nodos con un nuevo dato.

Idea: difundir rápidamente información utilizando únicamente información local a cada nodo.

Ventaja: es una técnica escalable, requiere pocas sincronizaciones entre nodos.

Suponemos que las actualizaciones se inician en un único nodo.

Terminología:

- Infectado: nodo que tiene un dato que desea transmitir.
- Susceptible: nodo que no ha visto aún este nuevo dato.
- Removido: nodo que no reenvia datos.

Modelos de propagación: antientropía y rumores

### Antientropia

Un nodo P eligue al azar un nodo vecino Q para intercambiar datos.

- P puede sólo envíar datos a Q (*push*)
- P puede sólo requerir datos de Q (*pull*)
- P y Q intercambian datos (*push-pull*)

Sólo utilizar *push* no es eficiente si existen muchos nodos infectados: la probabilidad de escoger un nodo susceptible es baja. Usar *pull* es conveniente cuando el número de nodos infectados es alto. Por lo tanto, la mejor estrategia es *push-pull*.

Ronda: intervalo de tiempo en el cual cada nodo intercambio datos con un nodo vecino al azar.

¿Cuántas rondas se necesitan para difundir a todos los nodos una actualización? Orden: O(log(N))

### Rumores

Variante de epidémico: si el nodo P contacta un nodo Q al azar para comunicar el dato x. Si Q ya conoce el dato, P dejará de transmitir el dato (con una probabilidad *p*).

Ventajas: difunde muy rapidamente las actualizaciones.
Desventaja: probabilidad de que no todos los nodos sean contactados.

Incluso con valores bajos de *p* existe la posibilidad de que algunos nodos no sean actualizados. Para valores altos de *p* se deben tomar acciones adicionales en caso de que se requiera que la mayoría o todos de los nodos sean actualizados.

### Rumores dirigidos

Una presunción que se hace es que un nodo P puede contactar _cualquier_ nodo Q de la red. Esto raramente es así (no se cuenta con una lista completa de los nodos).

## Eliminar datos

Los algoritmos epidemicos son excelentes para difundir una *actualización*.

Problema: es muy complicado difundir una *eliminación*.

Si un nodo elimina el datos *x* y posteriormente recibe una mensaje viejo de *actualización*, lo interpretará como un dato nuevo.

Solución: realizar *borrados lógicos*, reenviando *certificados de defunción*.

Problema: acumulación de *certificados*.

Si se sabe que el tiempo de propagación de una actualización es *n*, se puede eliminar un certificado luego de *n*... pero por las dudas, ciertos nodos específicos mantienen copias de estos certificados.




