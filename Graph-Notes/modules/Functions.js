import { buildGraph, normalizeTags, readArray, saveNote, deleteNote } from './notes.js';

let network = null;
let previousFocus = null;
const currentUser = () => sessionStorage.getItem('username');
const readNotes = () => readArray(localStorage, 'notas');
const findNote = id => readNotes().find(note => String(note.seq) === String(id) && note.user === currentUser());

export function openNav() {
  document.getElementById('mySidebar').inert = false;
  document.getElementById('mySidebar').style.width = '250px';
  document.getElementById('openNav').setAttribute('aria-expanded', 'true');
}
export function closeNav() {
  document.getElementById('mySidebar').inert = true;
  document.getElementById('mySidebar').style.width = '0';
  document.getElementById('openNav').setAttribute('aria-expanded', 'false');
}
export function changeContent(title) {
  const heading = document.createElement('h1');
  heading.className = 'location-app';
  heading.textContent = title;
  document.querySelector('.content').replaceChildren(heading);
}
export function ShowInfo(template) {
  network?.destroy();
  network = null;
  // Only static application templates enter this HTML sink.
  document.querySelector('.subContent').innerHTML = template;
}
export function guardarNota(user, id = null) {
  const values = Object.fromEntries(['titulo', 'contenido', 'etiquetas']
    .map(key => [key, document.getElementById(key).value]));
  localStorage.setItem('notas', JSON.stringify(saveNote(readNotes(), user, values, id)));
}
export function MostrarNotas(user) {
  const list = document.getElementById('notas-list');
  const fragment = document.createDocumentFragment();
  const notes = readNotes().filter(note => note.user === user);
  if (!notes.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Aún no tienes notas. Abre el menú y elige Crear Nota.';
    fragment.append(empty);
  }
  for (const note of notes) {
    const card = document.createElement('li');
    card.className = 'nota-card';
    const title = document.createElement('h2');
    title.className = 'notaCardTitle';
    title.textContent = note.titulo;
    const tags = document.createElement('p');
    tags.className = 'notaCardTags';
    tags.textContent = 'Etiquetas: ' + normalizeTags(note.etiquetas).join(', ');
    card.append(title, tags);
    for (const [action, label] of [['view', 'Ver'], ['edit', 'Editar'], ['delete', 'Eliminar']]) {
      const button = document.createElement('button');
      button.className = 'notaCardButton';
      button.dataset.action = action;
      button.dataset.note = note.seq;
      button.textContent = label;
      button.setAttribute('aria-label', label + ': ' + note.titulo);
      card.append(button);
    }
    fragment.append(card);
  }
  list.replaceChildren(fragment);
}
export function editarNota(id) {
  const note = findNote(id);
  if (!note) throw new Error('No se encontró la nota.');
  for (const key of ['titulo', 'contenido']) document.getElementById(key).value = note[key];
  document.getElementById('etiquetas').value = normalizeTags(note.etiquetas).join(', ');
  document.getElementById('save-button').textContent = 'Actualizar Nota';
}
export function eliminarNota(id) {
  localStorage.setItem('notas', JSON.stringify(deleteNote(readNotes(), currentUser(), id)));
}
export function agregarEtiquetasDatalist() {
  const tags = new Set(readNotes().filter(note => note.user === currentUser()).flatMap(note => normalizeTags(note.etiquetas)));
  const options = [...tags].sort().map(tag => {
    const option = document.createElement('option');
    option.value = tag;
    return option;
  });
  document.getElementById('etiquetasDatalist').replaceChildren(...options);
}
export function cerrarNota() {
  document.getElementById('NotaAlert').close();
  previousFocus?.focus();
}
export function mostrarNota(id) {
  const note = findNote(id);
  if (!note) return;
  previousFocus = document.activeElement;
  const dialog = document.getElementById('NotaAlert');
  const title = document.createElement('h2');
  title.id = 'dialog-title';
  title.textContent = note.titulo;
  const content = document.createElement('p');
  content.className = 'note-body';
  content.textContent = note.contenido;
  const tags = document.createElement('p');
  tags.textContent = 'Etiquetas: ' + normalizeTags(note.etiquetas).join(', ');
  const close = document.createElement('button');
  close.className = 'cerrarNotaButton';
  close.textContent = 'Cerrar';
  close.onclick = cerrarNota;
  dialog.replaceChildren(title, content, tags, close);
  dialog.showModal();
  close.focus();
}
export function actualizarGrafo() {
  const container = document.getElementById('grafo-container');
  if (!globalThis.vis) {
    container.textContent = 'No se pudo cargar el grafo. Comprueba tu conexión y recarga la página.';
    return;
  }
  const data = buildGraph(readNotes(), currentUser());
  if (!data.nodes.length) {
    container.textContent = 'Crea una nota para comenzar a visualizar el grafo.';
    return;
  }
  network = new vis.Network(container, data, {
    nodes: { shape: 'dot', font: { color: '#ffffff' } },
    edges: { smooth: false },
    physics: { stabilization: { iterations: 150 } }
  });
  network.once('stabilized', () => network?.setOptions({ physics: false }));
  network.on('doubleClick', params => {
    if (params.nodes.length) mostrarNota(params.nodes[0]);
  });
}
export function destruirSesion() {
  sessionStorage.removeItem('username');
  window.location.href = 'login.html';
}
