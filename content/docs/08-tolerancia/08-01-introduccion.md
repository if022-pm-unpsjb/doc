+++
title = 'Tolerancia a fallos'
date = 2024-10-22
draft = false
weight = 810 
type = 'docs'
+++

# Introducción a la tolerancia a fallos

Las **fallas parciales** son una característica de los sistemas distribuidos.

¿Como diseñar los sistemas distribuidos para que se recuperen de este tipo de fallas?

Idealmente automáticamente y sin degradar la performance.

## Tolerancia a fallas

Relacionado con el concepto de _dependable systems_

Algunos terminos:

### Disponibilidad

Es la probabilidad que el sistema este funcionando en cualquier momento.

### Confiabilidad

La probabilidad que el sistema ejecute continuamente sin fallos.

### Seguridad

No ocurre una catástrofe cuando eventualmente ocurre una falla.

### Mantenibilidad

Qué tan fácil es reparar el sistema ante una falla.

### Métricas

MTTF: Mean Time To Failure.

MTTR: Mean Time To Repair.

MTBF: Mean Time Between Failures ($MTTF + MTTR$)

### Avería (fail)

Cuando el sistema **no cumple** con sus especificaciones.

### Error

La parte del estado de un sistema que puede producir una **falla**.

### Falla (Fault)

La causa de un **error**.

Un sistema **tolerante a fallos** es aquel que puede proveer sus servicios aún ante la existencia de fallas.

Las fallas se pueden clasificar en:

- Transitorias: ocurren una única vez.
- Intermitentes: se repiten frecuentemente.
- Permanentes: presente hasta que el componente afectado es reparado/reemplazado.

## Modos de falla

Clasificación:

- Falla de detención (*crash failure*)

- Falla de omisión
    - Recepción
    - Envío

- Falla temporal

- Falla de respuesta
    - Valor
    - Transición de estado.

- Fallas arbitrarias
    - Omisión
    - Comisión

## Sincrónico / Asicrónico

Los modelos anteriores suponene que un proceso $P$ puede detectar que $Q$ se detuvo.

¿Cómo es posible esto?

Hay que diferenciar tipos de sistemas:

- Asincrónico: no se puede suponer nada acerca de los tiempos de ejecución o de transferencia de mensajes.
- Sincrónico: los tiempos de ejecución y de transmisión estan acotados.

Ninguno es un modelo realista.

En la práctica se asumen sistemas **parcialmente sincrónicos**:

- La mayor parte del tiempo se comportan como sistemas *sincrónicos*.
- El comportamiento *asincrónico* es la excepción.
- Se pueden uilizar *timeouts*, con el riesgo de tener *falsos positivos*.
 
En este contexto, las *fallas de detención* se pueden subclasificar:

- *Fail-stop*: fallas de detención que pueden ser detectadas con seguridad.
- *Fail-noisy*: similar, pero un proceso *eventualmente* detecta la falla.
- *Fail-silent*: no se puede distinguir fallas de detención de fallas de omisión.
- *Fail-safe*: fallas arbitrarias benignas.
- *Fail-arbitrary*: no observables y dañinas, la peor combinación.

## Enmascaramiento de fallas

La mejor manera de tolerar una falla es ocultarla mediante redundancia.

Tipos de redundancia:

- Información
- Temporal
- Física

Un ejemplo es la redundancia modular triple.
