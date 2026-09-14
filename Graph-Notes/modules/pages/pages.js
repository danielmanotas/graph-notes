export const createNotes = `
  <div class="app-container"><section class="side-bar">
    <h2>GRAPH NOTES</h2>
    <form id="note-form" class="form-container">
      <label for="titulo">Título:</label>
      <input id="titulo" maxlength="100" required>
      <label for="contenido">Contenido:</label>
      <textarea id="contenido" rows="12" maxlength="20000" required></textarea>
      <label for="etiquetas">Etiquetas (separadas por comas):</label>
      <input id="etiquetas" list="etiquetasDatalist" maxlength="100">
      <datalist id="etiquetasDatalist"></datalist>
      <button id="save-button" type="submit">Guardar Nota</button>
      <button id="cancel-button" class="cancel-button" type="button">Cancelar</button>
    </form>
  </section></div>`;
export const viewNotes = `<div class="main-content"><ul id="notas-list"></ul></div>`;
export const graph = `<section class="graph-view">
  <p>Las notas se conectan cuando comparten etiquetas. Haz doble clic en un nodo para leerlo.</p>
  <div id="grafo-container" aria-label="Grafo de relaciones entre notas"></div>
</section>`;
