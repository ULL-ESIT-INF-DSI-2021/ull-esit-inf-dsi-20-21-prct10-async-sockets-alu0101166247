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
