![Logo](img/logo.jpg)

##### José Daniel Fuentes Marra alu0101166247@ull.edu.es
# Informe de la práctica 10
## Cliente y servidor para una aplicación de procesamiento de notas de texto

## Introducción
 
En esta practica adaptaremos la practica 8 donde se creo una aplicación para gestionar notas pero con un cliente y un servidor.

## Objetivo
 
El objetivo de esta práctica es crear un servidor que sea capaz de manejar la aplicación de notas de la practica 8 y que diferentes clientes puedan conectarse a el y hacer peticiones y el servidor pueda gestionarlas y responder de vuelta.

Para el correcto funcionamiento de esta app primero se clona el repositorio y luego se ejecuta:
**npm install** para instalar las dependencias
**npm run start** para compilar y generar los .js

**Importante: Debe tener creado el repositorio 'notes-app-server' en /home/usuario para el correcto funcionamiento de esta aplicación**

## Contenido

Para empezar explicare las clases de las que hacen uso el servidor y el cliente, estas son User y Note las cuales ya fueron explicadas en la practica pasada pero brevemente sirven para definir la estructura de una nota y representar usuarios con una o mas notas. La clase User es la encargada mediante sus métodos de el manejo de ficheros con fs.

Estas serian la clases: 

```ts
```