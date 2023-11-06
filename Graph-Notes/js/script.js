import 
    {closeNav,
     changeContent,
     openNav,
     ShowInfo,
     guardarNota,
     MostrarNotas,
     actualizarNota,
     editarNota,
     eliminarNota,
     agregarEtiquetasDatalist,
     actualizarGrafo,
    destruirSesion} from '../modules/Functions.js';
import { createNotes,viewNotes,graph} from '../modules/pages/pages.js';


document.addEventListener('DOMContentLoaded', () =>{

    const username = sessionStorage.getItem('username');
    if (username === null) {
        location.href = 'login.html';
    }
    
    const user = sessionStorage.getItem('username');
    const openNavDiv = document.getElementById("openNav");
    openNavDiv.addEventListener('click', openNav);

    const ContentInicial = document.querySelector('.subContent');
    ContentInicial.innerHTML = '';
    changeContent('<i class="fas fa-eye"></i> Ver Notas');
    ContentInicial.innerHTML = viewNotes;
    MostrarNotas(user);

    const crearNotaLink = document.getElementById('crearNota');
    crearNotaLink.addEventListener('click', () => {
            changeContent('<i class="fas fa-pencil-alt"></i> Crear Notas');
            closeNav();
            ShowInfo(createNotes);
            const saveNote = document.querySelector('#save-button');
            agregarEtiquetasDatalist();
            saveNote.addEventListener('click', () => {
                guardarNota(user);
            });
            
    });

    const VerNotaLink = document.getElementById('verNota');
    VerNotaLink.addEventListener('click', () => {
            changeContent('<i class="fas fa-eye"></i> Ver Notas');
            closeNav();
            // ShowInfo(viewNotes);
            location.reload();
            MostrarNotas(user);
    });

    const grafosLink = document.getElementById('grafos');
    grafosLink.addEventListener('click', () => {
        changeContent('<i class="fas fa-project-diagram"></i> Grafos');
        closeNav();
        ShowInfo(graph);
        actualizarGrafo();
    });

    const OutSesion = document.querySelector("#CerrarSesion");
    OutSesion.addEventListener('click', () => {
        destruirSesion();
    });

    const EditNotes = document.querySelectorAll("#Edit");
EditNotes.forEach((EditNote) => {
    EditNote.addEventListener('click', () => {
        const NumNote = EditNote.getAttribute("data-nota");
        console.log(NumNote);
        changeContent('<i class="fas fa-pencil-alt"></i> Editar Notas');
        ShowInfo(createNotes);
        editarNota(NumNote);
        const UpdateButton = document.querySelector('.update-button');
        const CancelButton = document.querySelector('.cancel-button');
        UpdateButton.addEventListener('click', () => {
            actualizarNota(NumNote);
        });
        CancelButton.addEventListener('click', () => {
            location.href = 'index.html';
        });
    });
});


    const deleteButtons = document.querySelectorAll("#delete");
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            // const NumNote = document.getElementById("Numero").textContent;
            const NumNote = deleteButton.getAttribute("data-nota");
            console.log(NumNote)
           eliminarNota(NumNote);
        });
    });
    
        const ViewNote = document.querySelectorAll("#VerNota");
        ViewNote.forEach((ViewButton) => {
            ViewButton.addEventListener('click', () => {
                
                // const ContenidoNote = document.querySelectorAll(".nota-card")[index];
                /*const Titulo = ContenidoNote.querySelector("#notaCardTitle").textContent;
                const Descripcion = ContenidoNote.querySelector("#descrip").textContent;
                const Tags = ContenidoNote.querySelector("#notaCardTags").textContent;*/

                const Titulo = ViewButton.getAttribute("data-title");
                const Descripcion = ViewButton.getAttribute("data-descript");
                const Tags = ViewButton.getAttribute("data-tags");
                
                const notaAlert = document.getElementById("NotaAlert");
                const fondoOscuro = document.getElementById("FondoOscuro");
                notaAlert.style.zIndex = 2;
            const mostrar = `
                            <h2 class="title">${Titulo}</h2>
                            <p class="content">${Descripcion}</p>
                            <span class="Tags">${Tags}</span>
                            <button id="CerrarNota" class="cerrarNotaButton">Cerrar</button>
                `;

                notaAlert.innerHTML = '';  
                notaAlert.innerHTML = mostrar;
                fondoOscuro.style.display = 'block';
                notaAlert.style.opacity = 1;
                notaAlert.style.transform = "translate(-50%, -50%) scale(1)";
                    const cerrarNotaButton = document.getElementById("CerrarNota");
                    cerrarNotaButton.addEventListener("click", function () {
                        notaAlert.style.opacity = 0;
                        notaAlert.style.transform = "translate(-50%, -50%) scale(0.7)";
                        notaAlert.style.zIndex = -2;
                        setTimeout(() => {
                            fondoOscuro.style.display = "none";
                        }, 300);
                    });
            });
        });

    document.addEventListener('click', function (event) {
        if (event.target !== document.getElementById("openNav") && event.target 
             !== crearNotaLink && event.target !== grafosLink) {
            closeNav();
        }
    });
});    