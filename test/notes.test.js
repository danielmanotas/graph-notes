import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTags, readArray, saveNote, deleteNote, buildGraph } from '../Graph-Notes/modules/notes.js';

const note = (seq, user = 'ana', etiquetas = ['tema'], titulo = 'Repetido') =>
  ({ seq, user, etiquetas, titulo, contenido: 'Contenido' });
const values = { titulo: ' Editada ', contenido: ' Texto ', etiquetas: 'tema, tema, , otro' };

test('editing after deletion uses identity, preserves other notes and does not mutate input', () => {
  const original = [note(0), note(1), note(2)];
  const remaining = deleteNote(original, 'ana', '0');
  const edited = saveNote(remaining, 'ana', values, '2');
  assert.equal(edited[0].seq, 1);
  assert.equal(edited[0].titulo, 'Repetido');
  assert.equal(edited[1].titulo, 'Editada');
  assert.equal(original[2].titulo, 'Repetido');
});
test('deletion and editing cannot target another local user', () => {
  const notes = [note(7, 'bea'), note(10)];
  assert.deepEqual(deleteNote(notes, 'ana', '7'), notes);
  assert.throws(() => saveNote(notes, 'ana', values, '7'));
  assert.deepEqual(deleteNote(notes, 'ana', 'missing'), notes);
});
test('creation chooses an unused numeric ID even when notes are not sorted', () => {
  const result = saveNote([note(8), note(2)], 'ana', values);
  assert.equal(result.at(-1).seq, 9);
  assert.deepEqual(result.at(-1).etiquetas, ['tema', 'otro']);
});
test('blank titles and content are rejected', () => {
  assert.throws(() => saveNote([], 'ana', { ...values, titulo: ' ' }));
  assert.throws(() => saveNote([], 'ana', { ...values, contenido: ' ' }));
});
test('tags remove blanks and duplicates while preserving case', () => {
  assert.deepEqual(normalizeTags('a, , a, B,'), ['a', 'B']);
  assert.deepEqual(normalizeTags(''), []);
});
test('graph supports duplicate titles, deduplicates edges and isolates users', () => {
  const graph = buildGraph([note(1, 'ana', ['a', 'b']), note(2, 'ana', ['a', 'b']),
    note(3, 'bea', ['a']), note(4, 'ana', [''])], 'ana');
  assert.deepEqual(graph.nodes.map(node => node.id), [1, 2, 4]);
  assert.deepEqual(graph.edges, [{ from: 1, to: 2 }]);
});
test('blank tags never link unrelated notes', () => {
  assert.deepEqual(buildGraph([note(0, 'ana', ['']), note(1, 'ana', [''])], 'ana').edges, []);
});
test('indexed graph matches pairwise reference on varied data', () => {
  const notes = Array.from({ length: 100 }, (_, i) => note(i, i % 3 ? 'ana' : 'bea', ['t' + i % 7, 't' + i % 11]));
  const own = notes.filter(note => note.user === 'ana');
  const expected = [];
  for (let i = 0; i < own.length; i++) {
    for (let j = i + 1; j < own.length; j++) {
      if (own[i].etiquetas.some(tag => own[j].etiquetas.includes(tag))) expected.push(own[i].seq + ':' + own[j].seq);
    }
  }
  const actual = buildGraph(notes, 'ana').edges.map(edge => edge.from + ':' + edge.to);
  assert.deepEqual(actual.sort(), expected.sort());
});
test('storage accepts missing data and refuses corrupted values without replacing them', () => {
  assert.deepEqual(readArray({ getItem: () => null }, 'notas'), []);
  assert.deepEqual(readArray({ getItem: () => '[]' }, 'notas'), []);
  for (const value of ['{bad', '{}', 'null']) {
    assert.throws(() => readArray({ getItem: () => value }, 'notas'));
  }
});
