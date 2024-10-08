+++
title = 'Consistencia'
date = 2024-09-18T23:04:03-03:00
draft = false
weight = 700 
+++

# Introducción

## Razones para replicar

Existen **dos** razones para replicar:

- Incrementar la **confiabilidad** del sistema
- Mejorar la **perfomance**
    - Tamaño: incrementar el número de peticiones que se atienden
    - Área geográfica: reducción de lantecias (acercar copias a los clientes)

Todo muy bonito ¿Quién podría estar en contra de replicar?

La cruda realidad: hay un **precio que pagar**, ya que replicar genera **problemas de consistencia**.

Cada vez que se modifica una replica, se tienen que actualizar el resto de las copias.

**Cuándo** y **cómo** se realizan estas actualizaciones determina el costo de la replicación.

## Escalabilidad mediante replicación

En general, los problemas de escalabilidad aparecen como **problemas de perfomance**.

Se intentan paliar con una combinación de **replicación** y **cacheo**

- La replicación es iniciada por el servidor y el cacheo por el cliente.

Ejemplo:
- Problema: alta latencia en las peticiones
- Solucion: agregar replicas cercanas a los clientes
- Nuevo problema: ancho de banda requerido para mantener todas las replicas consistentes.

Otro ejemplo:
- Suponer un cliente que hace requerimientos a un ritmo $N$.
- La replica más cercana al cliente se actualiza a un ritmo $M$.
- Si $N << M$, entonces se esta desperdiciando ancho de banda.

Ademas, mantener las replicas sincronizadas... **atenta contra la escalabilidad**

- ¡Justamente lo que estamos intentando mejorar!

- Por ejemplo, una transacción atómica sobre múltiples replicas.

- Mantener las replicas sincronizadas requiere coordinación lo que puede ser muy costoso.

**Dilema**: aunque los problemas de escalabilidad pueden ser resueltos con replicación, mantener las copias sincronizadas es costoso. ¿El remedio es peor que le enfermedad?

**Solución**

Una posible solución es **relajar** los requerimientos de consistencia

- Las actualizaciones no requieren ser operaciones atómicas

- Las replicas entonces pueden no estar sincronizadas

- Cúanto y cómo disminuir la consistencia depende del patrón lectura/escritura.


