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
/**
 * Clase Note para representar Notas
 */
export class Note {
  /**
   * Constructor de la clase
   * @param title Titulo
   * @param body Contenido
   * @param color Color
   */
  constructor(
    public title: string,
    public body: string,
    public color: string) { }

  /**
   * Get del titulo
   * @returns Titulo
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Set para cambiar el titulo
   * @param title Titulo nuevo
   */
  public setTitle(title: string): void {
    this.title = title;
  }

  /**
   * Get del contenido
   * @returns Contenido
   */
  public getBody(): string {
    return this.body;
  }

  /**
   * Set para cambiar el contenido
   * @param body Body
   */
  public setBody(body: string): void {
    this.body = body;
  }

  /**
  * Get del color
  * @returns Color
  */
  public getColor(): string {
    return this.color;
  }

  /**
  * Set para cambiar el color
  * @param color Nuevo color
  */
  public setColor(color: string): void {
    this.color = color;
  }
}
```

Esta clase simplemente se encarga de dar una estructura a las notas.

Ahora explicare un poco la aplicación cliente que es la encargada de recibir mediante yargs los parámetros que ingrese el usuario y convertirlo en una petición (request) para enviarla al servidor.

```ts
/* eslint-disable max-len */
import * as net from 'net';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {RequestType} from '../server/server';
import {Note} from '../server/note';

const client = net.connect({port: 60300});

/**
 * Add command
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note Title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') && (typeof argv.color === 'string')) {
      const request: RequestType = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
      client.write(JSON.stringify(request) + '\n');
    }
  },
});

/**
 * List Command
 */
yargs.command({
  command: 'list',
  describe: 'List user notes',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const request: RequestType = {
        type: 'list',
        user: argv.user,
      };
      client.write(JSON.stringify(request) + '\n');
    }
  },
});

/**
 * Update command
 */
yargs.command({
  command: 'update',
  describe: 'update a note',
  builder: {
    user: {
      describe: 'Note User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note Title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string') && (typeof argv.body === 'string') && (typeof argv.color === 'string')) {
      const request: RequestType = {
        type: 'update',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
      client.write(JSON.stringify(request) + '\n');
    }
  },
});

/**
 * Remove Command
 */
yargs.command({
  command: 'remove',
  describe: 'Remove note',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      const request: RequestType = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      client.write(JSON.stringify(request) + '\n');
    }
  },
});

/**
 * Read Command
 */
yargs.command({
  command: 'read',
  describe: 'Read note',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note Title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      const request: RequestType = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
      client.write(JSON.stringify(request) + '\n');
    }
  },
});

/**
 * Funcion para mostrar por consola las notas
 * @param notes Arreglo de notas
 */
function printNotes(notes: Note[]) {
  // console.log(notes);
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].color === 'blue') {
      console.log(chalk.blue(notes[i].title));
    }
    if (notes[i].color === 'red') {
      console.log(chalk.red(notes[i].title));
    }
    if (notes[i].color === 'green') {
      console.log(chalk.green(notes[i].title));
    }
    if (notes[i].color === 'yellow') {
      console.log(chalk.yellow(notes[i].title));
    }
  }
}

/**
 * Funcion para mostar una nota con su contenido
 * @param notes Arreglo de notas
 */
function printOneNote(notes: Note[]) {
  const i = 0;
  if (notes[i].color === 'blue') {
    console.log(chalk.blue(notes[i].title));
    console.log(chalk.blue(notes[i].body));
  }
  if (notes[i].color === 'red') {
    console.log(chalk.red(notes[i].title));
    console.log(chalk.red(notes[i].body));
  }
  if (notes[i].color === 'green') {
    console.log(chalk.green(notes[i].title));
    console.log(chalk.green(notes[i].body));
  }
  if (notes[i].color === 'yellow') {
    console.log(chalk.yellow(notes[i].title));
    console.log(chalk.yellow(notes[i].body));
  }
}

/**
 * Evento que recibe pedazos de datos del servidor y emite un evento cuando se completa un mensaje completo
 */
let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
  let messageLimit = wholeData.indexOf('\n');
  while (messageLimit !== -1) {
    const message = wholeData.substring(0, messageLimit);
    wholeData = wholeData.substring(messageLimit + 1);
    client.emit('response', JSON.parse(message));
    messageLimit = wholeData.indexOf('\n');
  }
});

/**
 * Evento que se ejecuta cuando un response del servidor se completa
 */
client.on('response', (response) => {
  if (response.type === 'add') {
    if (response.success) {
      console.log(chalk.green('New note added!'));
    } else {
      console.log(chalk.red('Note title taken!'));
    }
  }
  if (response.type === 'update') {
    if (response.success) {
      console.log(chalk.green('Note updated!'));
    } else {
      console.log(chalk.red('Note not found!'));
    }
  }
  if (response.type === 'remove') {
    if (response.success) {
      console.log(chalk.green('Note removed!'));
    } else {
      console.log(chalk.red('Note not found!'));
    }
  }
  if (response.type === 'read') {
    if (response.success) {
      if (response.notes != undefined) {
        printOneNote(response.notes);
      }
    } else {
      console.log(chalk.red('Note not found!'));
    }
  }
  if (response.type === 'list') {
    if (response.success) {
      console.log(chalk.green('Your notes:'));
      if (response.notes != undefined) {
        printNotes(response.notes);
      }
    } else {
      console.log(chalk.red('You have no notes!'));
    }
  }
});

yargs.parse();
```

Para empezar cada comando del yargs recibe los parámetros necesarios por parte del usuario y en cada uno se crea un request con la estructura RequestType que se envía al servidor. También podemos ver como se gestionan dos eventos: el primero es 'data' y este recibe la información del servidor ya sea completa o por partes y esta información se va almacenando y cada vez que se completa un mensaje del servidor (en este caso separado por \n) se emite un evento 'response' que se encarga de procesar la respuesta del servidor que esta estructurada en forma de response (ResponseType) y contiene la respuesta del servidor y esta parte del cliente se encarga de procesar que tipo de response fue y si fue satisfactoria o no, mostrando por consola la salida correspondiente.

Del lado del servidor tenemos el siguiente código:

```ts
/* eslint-disable max-len */
import chalk = require('chalk');
import * as net from 'net';
import {Note} from './note';
import {User} from './user';

/**
 * Tipo de dato para representar un request para el servidor
 */
export type RequestType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    user: string;
    title?: string;
    body?: string;
    color?: string;
  }

/**
 * Tipo de dato para representar un response para el cliente
 */
export type ResponseType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    success: boolean;
    notes?: Note[];
  }

const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log(chalk.green('A client has connected.'));

  /**
  * Evento que recibe pedazos de datos del cliente y emite un evento cuando se completa un mensaje completo
  */
  let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;
    let messageLimit = wholeData.indexOf('\n');
    while (messageLimit !== -1) {
      const message = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      connection.emit('request', JSON.parse(message));
      messageLimit = wholeData.indexOf('\n');
    }
  });

  /**
  * Evento que se ejecuta cuando un request del cliente se completa
  */
  connection.on('request', (request) => {
    if (request.type === 'add') {
      const user = new User(request.user);
      if (request.title != undefined && request.body != undefined && request.color != undefined) {
        if (user.addNote(request.title, request.body, request.color)) {
          const response: ResponseType = {
            type: 'add',
            success: true,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        } else {
          const response: ResponseType = {
            type: 'add',
            success: false,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        }
      }
    }
    if (request.type === 'update') {
      const user = new User(request.user);
      if (request.title != undefined && request.body != undefined && request.color != undefined) {
        if (user.updateNote(request.title, request.body, request.color)) {
          const response: ResponseType = {
            type: 'update',
            success: true,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        } else {
          const response: ResponseType = {
            type: 'update',
            success: false,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        }
      }
    }
    if (request.type === 'remove') {
      const user = new User(request.user);
      if (request.title != undefined) {
        if (user.removeNote(request.title)) {
          const response: ResponseType = {
            type: 'remove',
            success: true,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        } else {
          const response: ResponseType = {
            type: 'remove',
            success: false,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        }
      }
    }
    if (request.type === 'read') {
      const user = new User(request.user);
      if (request.title != undefined) {
        if (user.readNote(request.title) === false) {
          const response: ResponseType = {
            type: 'read',
            success: false,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        } else {
          const note = user.readNote(request.title);
          if (typeof note != 'boolean') {
            const response: ResponseType = {
              type: 'read',
              success: true,
              notes: [note],
            };
            connection.write(JSON.stringify(response) + '\n');
            connection.end();
          }
        }
      }
    }
    if (request.type === 'list') {
      const user = new User(request.user);
      if (user.listNotes() === false) {
        const response: ResponseType = {
          type: 'list',
          success: false,
        };
        connection.write(JSON.stringify(response) + '\n');
        connection.end();
      } else {
        const notes = user.listNotes();
        if (typeof notes != 'boolean') {
          const response: ResponseType = {
            type: 'list',
            success: true,
            notes: notes,
          };
          connection.write(JSON.stringify(response) + '\n');
          connection.end();
        }
      }
    }
  });

  connection.on('close', () => {
    console.log(chalk.red('A client has disconnected'));
  });
});

server.listen(60300, () => {
  console.log(chalk.yellow('Waiting for clients to connect.'));
});
```

El funcionamiento es parecido al cliente, el evento 'data' va acumulando entradas hasta conseguir un mensaje completo el cual emite un evento 'request' el cual analiza la petición del cliente y dependiendo de lo que contenga se realizan acciones con las clases antes explicadas las cuales devuelven respuestas y son adaptadas a ResponseType para ser enviadas al cliente.

## Conclusión
 
En conclusión el uso de sockets es muy importante ya que es fundamental en las comunicaciones entre servidores y clientes y con esta practica se entienden muchos conceptos sobre sockets vistos en clase.
 
## Bibliografía

* [Guión de la Práctica](https://ull-esit-inf-dsi-2021.github.io/prct10-async-sockets/)
* [Node.js Module Net](https://nodejs.org/dist/latest-v16.x/docs/api/net.html)
* [Yargs](https://www.npmjs.com/package/yargs)
* [Apartado de Sockets de los apuntes](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-sockets.html)