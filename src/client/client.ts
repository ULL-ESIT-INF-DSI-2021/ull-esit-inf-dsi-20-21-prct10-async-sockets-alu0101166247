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
