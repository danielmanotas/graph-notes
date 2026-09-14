import { closeNav, changeContent, openNav, ShowInfo, guardarNota, MostrarNotas,
  editarNota, eliminarNota, agregarEtiquetasDatalist, actualizarGrafo,
  destruirSesion, mostrarNota } from '../modules/Functions.js';
import { createNotes, viewNotes, graph } from '../modules/pages/pages.js';

const user = sessionStorage.getItem('username');
if (!user) {
  location.replace('login.html');
} else {
  const run = action => {
    document.getElementById('app-message').textContent = '';
    try { action(); } catch (error) { document.getElementById('app-message').textContent = error.message; }
  };
  const showList = () => {
    changeContent('Ver Notas');
    ShowInfo(viewNotes);
    MostrarNotas(user);
  };
  const showEditor = (id = null) => {
    changeContent(id === null ? 'Crear Nota' : 'Editar Nota');
    ShowInfo(createNotes);
    agregarEtiquetasDatalist();
    if (id !== null) editarNota(id);
    document.getElementById('note-form').addEventListener('submit', event => {
      event.preventDefault();
      run(() => { guardarNota(user, id); showList(); });
    });
    document.getElementById('cancel-button').onclick = () => run(showList);
    document.getElementById('titulo').focus();
  };
  const actions = {
    crearNota: () => showEditor(),
    verNota: showList,
    grafos: () => { changeContent('Grafos'); ShowInfo(graph); actualizarGrafo(); },
    CerrarSesion: destruirSesion
  };
  document.getElementById('openNav').onclick = openNav;
  document.getElementById('mySidebar').addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !actions[link.id]) return;
    event.preventDefault();
    closeNav();
    run(actions[link.id]);
  });
  document.querySelector('.subContent').addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    run(() => {
      const id = button.dataset.note;
      if (button.dataset.action === 'view') mostrarNota(id);
      if (button.dataset.action === 'edit') showEditor(id);
      if (button.dataset.action === 'delete' && confirm('¿Deseas eliminar esta nota?')) {
        eliminarNota(id);
        showList();
      }
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#mySidebar, #openNav')) closeNav();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
  run(showList);
}
