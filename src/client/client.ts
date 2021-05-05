/* eslint-disable max-len */
import * as net from 'net';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {ResponseType, RequestType} from '../server/server';
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
      client.write(JSON.stringify(request));
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
      client.write(JSON.stringify(request));
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
      client.write(JSON.stringify(request));
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
      client.write(JSON.stringify(request));
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
      client.write(JSON.stringify(request));
    }
  },
});

function printNotes(notes: Note[]) {
  console.log(notes);
  /*
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].getColor() === 'blue') {
      console.log(chalk.blue(notes[i].getTitle()));
    }
    if (notes[i].getColor() === 'green') {
      console.log(chalk.green(notes[i].getTitle()));
    }
    if (notes[i].getColor() === 'red') {
      console.log(chalk.red(notes[i].getTitle()));
    }
    if (notes[i].getColor() === 'yellow') {
      console.log(chalk.yellow(notes[i].getTitle()));
    }
  }*/
}

function printOneNote(notes: Note[]) {
  const i = 0;
  console.log(notes[i]);
  /*
  if (notes[i].getColor() === 'blue') {
    console.log(chalk.blue(notes[i].getTitle()));
    console.log(chalk.blue(notes[i].getBody()));
    console.log(chalk.blue(notes[i].getColor()));
  }
  if (notes[i].getColor() === 'green') {
    console.log(chalk.green(notes[i].getTitle()));
    console.log(chalk.green(notes[i].getBody()));
    console.log(chalk.green(notes[i].getColor()));
  }
  if (notes[i].getColor() === 'red') {
    console.log(chalk.red(notes[i].getTitle()));
    console.log(chalk.red(notes[i].getBody()));
    console.log(chalk.red(notes[i].getColor()));
  }
  if (notes[i].getColor() === 'yellow') {
    console.log(chalk.yellow(notes[i].getTitle()));
    console.log(chalk.yellow(notes[i].getBody()));
    console.log(chalk.yellow(notes[i].getColor()));
  }*/
}

client.on('data', (dataJSON) => {
  const response:ResponseType = JSON.parse(dataJSON.toString());
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
