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
