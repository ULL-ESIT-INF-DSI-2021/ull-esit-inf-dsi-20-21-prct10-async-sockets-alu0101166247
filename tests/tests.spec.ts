/* eslint-disable max-len */
import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/server/note';
import {User} from '../src/server/user';


describe('Note Class tests:', () => {
  // Notes
  const RedNote = new Note('Red Note', 'This is a red note', 'red');

  // Note Tests
  it('RedNote.getTitle() returns value Red Note', () => {
    expect(RedNote.getTitle()).to.be.equal('Red Note');
  });
  it('RedNote.getBody() returns value This is a red note', () => {
    expect(RedNote.getBody()).to.be.equal('This is a red note');
  });
  it('RedNote.getColor() returns value Red', () => {
    expect(RedNote.getColor()).to.be.equal('red');
  });
});

describe('User Class tests:', () => {
  // User
  const Dany = new User('Dany');

  // User Tests
  it('Dany.readNote(\'No Test Note\') returns value false', () => {
    expect(Dany.readNote('No Test Note')).to.be.equal(false);
  });
}); 
