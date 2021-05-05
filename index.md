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

**User**

```ts
/* eslint-disable max-len */
import {Note} from './note';
import * as fs from 'fs';
import chalk = require('chalk');

/**
 * Clase para representar un Usuario
 */
export class User {
  /**
   * Arreglo que guarda las notas de un usuario
   */
  private notes: Note[] = [];
  /**
   * Constructor de la clase
   * @param name Nombre del usuario
   */
  constructor(
        private name: string) {
    const folderExist: boolean = fs.existsSync(`/home/usuario/notes-app-server/${this.name}`);
    if (folderExist) {
      const userFolder = fs.readdirSync(`/home/usuario/notes-app-server/${this.name}/`);
      userFolder.forEach((noteFile) => {
        const noteContent = fs.readFileSync(`/home/usuario/notes-app-server/${this.name}/${noteFile}`);
        const jsonNote = JSON.parse(noteContent.toString());
        const note = new Note(jsonNote.title, jsonNote.body, jsonNote.color);
        this.notes.push(note);
      });
    } else {
      fs.mkdirSync(`/home/usuario/notes-app-server/${this.name}`);
    }
  }

  /**
   * Get del nombre
   * @returns Nombre
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Funcion que devuelve todas las notas de un usuario
   * @returns Arreglo con las notas de un usuario
   */
  public listNotes(): boolean | Note[] {
    if (this.notes.length === 0) {
      return false;
    } else {
      return this.notes;
    }
  }

  /**
   * Funcion que agrega una nota a un usuario
   * @param title Titulo
   * @param body Contenido
   * @param color Color
   * @returns True o False depende del resultado
   */
  public addNote(title: string, body: string, color: string): boolean {
    const fileExist: boolean = fs.existsSync(`/home/usuario/notes-app-server/${this.name}/${title}.json`);
    if (fileExist == false) {
      this.notes.push(new Note(title, body, color));
      fs.writeFile(`/home/usuario/notes-app-server/${this.name}/${title}.json`, `{\n\t"title": "${title}",\n\t"body": "${body}",\n\t"color": "${color}"\n}`, () => {
        console.log(chalk.green('New note added!'));
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Funcion que elimina una nota de un usuario
   * @param title Titulo
   * @returns True o False depende del resultado
   */
  public removeNote(title: string): boolean {
    const fileExist: boolean = fs.existsSync(`/home/usuario/notes-app-server/${this.name}/${title}.json`);
    if (fileExist == false) {
      return false;
    } else {
      let index = 0;
      let i = 0;
      this.notes.forEach((note) => {
        if (note.getTitle() == title) {
          index = i;
        }
        i++;
      });
      this.notes.splice(index, 1);
      fs.rm(`/home/usuario/notes-app-server/${this.name}/${title}.json`, () => {
        console.log(chalk.green('Note removed!'));
      });
      return true;
    }
  }

  /**
   * Funcion que actualiza una nota de un usuario
   * @param title Titulo
   * @param body Contenido
   * @param color Color
   * @returns True o False depende del resultado
   */
  public updateNote(title: string, body: string, color: string): boolean {
    const fileExist: boolean = fs.existsSync(`/home/usuario/notes-app-server/${this.name}/${title}.json`);
    if (fileExist == false) {
      return false;
    } else {
      let index = 0;
      let i = 0;
      this.notes.forEach((note) => {
        if (note.getTitle() == title) {
          index = i;
        }
        i++;
      });
      this.notes[index].setBody(body);
      this.notes[index].setColor(color);
      fs.writeFile(`/home/usuario/notes-app-server/${this.name}/${title}.json`, `{\n\t"title": "${title}",\n\t"body": "${body}",\n\t"color": "${color}"\n}`, () => {
        console.log(chalk.green('Note updated!'));
      });
      return true;
    }
  }

  /**
   * Funcion que devuelve una nota en especifico
   * @param title Titulo
   * @returns Nota buscada
   */
  public readNote(title: string): boolean | Note {
    const fileExist: boolean = fs.existsSync(`/home/usuario/notes-app-server/${this.name}/${title}.json`);
    if (fileExist == false) {
      return false;
    } else {
      let index = 0;
      let i = 0;
      this.notes.forEach((note) => {
        if (note.getTitle() == title) {
          index = i;
        }
        i++;
      });
      return this.notes[index];
    }
  }
}
```

Se puede ver como incorpora los métodos necesarios para la practica que son agregar, eliminar, actualizar, leer y listar notas. Cada función internamente se encarga del manejo de ficheros con fs para gestionas el directorio de notas del servidor.

**Note**

```ts

```