export function normalizeTags(value) {
  return [...new Set((Array.isArray(value) ? value : value.split(','))
    .map(tag => tag.trim()).filter(Boolean))];
}
export function readArray(storage, key) {
  const raw = storage.getItem(key);
  if (raw === null) return [];
  try {
    const value = JSON.parse(raw);
    if (Array.isArray(value)) return value;
  } catch { /* Preserve damaged data for recovery. */ }
  throw new Error('Datos locales inválidos: ' + key + '. Haz una copia antes de restaurarlos.');
}
export function saveNote(notes, user, values, id = null) {
  const titulo = values.titulo.trim();
  const contenido = values.contenido.trim();
  if (!user || !titulo || !contenido) throw new Error('Escribe un título y un contenido.');
  if (titulo.length > 100 || contenido.length > 20000) throw new Error('La nota supera el límite permitido.');
  const fields = { titulo, contenido, etiquetas: normalizeTags(values.etiquetas) };
  if (id !== null) {
    const index = notes.findIndex(note => String(note.seq) === String(id) && note.user === user);
    if (index === -1) throw new Error('No se encontró la nota de este usuario.');
    return notes.map((note, i) => i === index ? { ...note, ...fields } : note);
  }
  const seq = notes.reduce((max, note) => Number.isSafeInteger(note.seq) ? Math.max(max, note.seq) : max, -1) + 1;
  return [...notes, { seq, user, ...fields }];
}
export function deleteNote(notes, user, id) {
  return notes.filter(note => !(String(note.seq) === String(id) && note.user === user));
}
export function buildGraph(notes, user) {
  const ownNotes = notes.filter(note => note.user === user);
  const byTag = new Map();
  const edges = [];
  const pairs = new Set();
  for (const note of ownNotes) {
    for (const tag of normalizeTags(note.etiquetas)) {
      const related = byTag.get(tag) ?? [];
      for (const other of related) {
        const key = JSON.stringify([other, note.seq]);
        if (!pairs.has(key)) {
          pairs.add(key);
          edges.push({ from: other, to: note.seq });
        }
      }
      related.push(note.seq);
      byTag.set(tag, related);
    }
  }
  return { nodes: ownNotes.map(note => ({ id: note.seq, label: note.titulo })), edges };
}
