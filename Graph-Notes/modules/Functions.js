const notas = JSON.parse(localStorage.getItem('notas')) || [];
const etiquetas = new Set();
let notaActual = null;
const edges = [];

// console.log(notas);

//Sidebar
export const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("openNav").style.display = "none";
}

export const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("openNav").style.display = "block";
}

export const changeContent = (contenido) =>{
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = '';
    contentDiv.innerHTML = `<h1 class="location-app">${contenido}</h1>`;
}

export const ShowInfo = (Info) =>{
  const subContent = document.querySelector('.subContent');
  subContent.innerHTML = '';
  subContent.innerHTML = Info;
}

//Notas
export function guardarNota(user) {
    const tituloInput = document.getElementById('titulo');
    const contenidoInput = document.getElementById('contenido');
    const etiquetasInput = document.getElementById('etiquetas');

    let suma = 0;
    for (let note of notas) {
        let numero = note.seq;
        suma = numero + 1;
    };
    const seq = suma;
    const titulo = tituloInput.value;
    const contenido = contenidoInput.value;
    const etiquetasArray = etiquetasInput.value.split(',').map(etiqueta => etiqueta.trim());

    notas.push({ seq,user,titulo, contenido, etiquetas: etiquetasArray });

    localStorage.setItem('notas', JSON.stringify(notas));

    tituloInput.value = '';
    contenidoInput.value = '';
    etiquetasInput.value = '';
    
    alert("¡Nota Grabada Correctamente!");
    location.href = 'index.html';
}

export function MostrarNotas(user) {
    const notasList = document.getElementById('notas-list');
    notasList.innerHTML = '';

    const notasDelUsuario = notas.filter(nota => nota.user === user);

    for (let i = 0; i < notasDelUsuario.length; i++) {
        const nota = notasDelUsuario[i];
        const card = document.createElement('li');
        card.className = 'nota-card';

        card.innerHTML = `
                <div id="Numero">${nota.seq}</div>
                <div id="notaCardTitle">${nota.titulo}</div>
                <div id="descrip">${nota.contenido}</div>
                <div id="notaCardTags">Etiquetas: ${nota.etiquetas.join(', ')}</div>
                <button id="VerNota" class="notaCardButton"><i class="far fa-eye"></i></button>
                <button id="Edit" class="notaCardButton" data-nota="${nota.seq}"><i class="fas fa-edit"></i></button>
                <button id="delete" class="notaCardButton"><i class="fas fa-trash-alt"></i></button>
        `;

        notasList.appendChild(card);
    }

    etiquetas.clear();
    for (const nota of notasDelUsuario) {
        for (const etiqueta of nota.etiquetas) {
            etiquetas.add(etiqueta);
        }
    }
}

export function actualizarNota() {
    if (notaActual) {
        const validar = confirm("¿Desea Guardar los Cambios?");
        if(validar === true){
            const tituloInput = document.getElementById('titulo');
            const contenidoInput = document.getElementById('contenido');
            const etiquetasInput = document.getElementById('etiquetas');

            notaActual.titulo = tituloInput.value;
            notaActual.contenido = contenidoInput.value;
            notaActual.etiquetas = etiquetasInput.value.split(',').map(etiqueta => etiqueta.trim());

            localStorage.setItem('notas', JSON.stringify(notas));
            
            tituloInput.value = '';
            contenidoInput.value = '';
            etiquetasInput.value = '';

            const updateButton = document.querySelector('.update-button');
            updateButton.style.display = 'none';

            const saveButton = document.getElementById('save-button');
            saveButton.style.display = 'inline-block';       

            alert("Nota Actualizada Correctamente");
        } 
    }
}

export function editarNota(index) {
    notaActual = notas[index];
    const tituloInput = document.getElementById('titulo');
    const contenidoInput = document.getElementById('contenido');
    const etiquetasInput = document.getElementById('etiquetas');

    tituloInput.value = notaActual.titulo;
    contenidoInput.value = notaActual.contenido;
    etiquetasInput.value = notaActual.etiquetas.join(', ');

    const saveButton = document.getElementById('save-button');
    saveButton.style.display = 'none';    

    const updateButton = document.querySelector('.update-button');
    if (!updateButton) {
        const updateButton = document.createElement('button');
        const cancel = document.createElement('button');
        updateButton.className = 'update-button';
        updateButton.textContent = 'Actualizar Nota';
        cancel.className = 'cancel-button';
        cancel.textContent = 'cancelar';
        document.querySelector('.form-container').appendChild(updateButton);
        document.querySelector('.form-container').appendChild(cancel);
    } else {
        updateButton.style.display = 'inline-block';
    }
}

export function eliminarNota(index) {
    let validar = confirm("¿Desea Eliminar la Nota?");
    if(validar === true){
        notas.splice(index, 1);
        localStorage.setItem('notas', JSON.stringify(notas));
        location.href = 'index.html';
    }
}

export function agregarEtiquetasDatalist() {
    
    if(etiquetas.size > 0){
        const tag = document.querySelector('#etiquetas');
        tag.innerHTML = '';

        var str = '';
        etiquetas.forEach((etiqueta) =>{
        str += '<option value="'+etiqueta+'"/>';
        });

        const tags = document.querySelector('#etiquetasDatalist');
        tags.innerHTML = str;
}}
/*
export function MostrarAlert(Msg){
      
      
      
     window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('popup')) {
          document.getElementById('popup').style.display = 'none';
        }
      });
}*/

//Grafos
const nodes = new vis.DataSet();
const data = { nodes, edges };
const options = {
    nodes: {
      shape: 'circle',
    },
    edges: {
      length: 1000,
      smooth: {
        enabled: false,
      },
    },
  };
  
  export function actualizarGrafo() {
    const container = document.querySelector('#grafo-container');
    const network = new vis.Network(container, data, options);
    nodes.clear();
    edges.length = 0;
    const etiquetasRelacionadas = {};
    
    // Obtener el usuario activo desde sessionStorage
    const usuarioActivo = sessionStorage.getItem('username');

    for (let i = 0; i < notas.length; i++) {
        const notaA = notas[i];
        // Verificar si la nota pertenece al usuario activo
        if (notaA.user === usuarioActivo) {
            nodes.add({ id: notaA.titulo, label: notaA.titulo });
            for (let j = 0; j < notas.length; j++) {
                if (i !== j) {
                    const notaB = notas[j];
                    // Verificar si la nota B también pertenece al usuario activo
                    if (notaB.user === usuarioActivo) {
                        const etiquetasEnComun = notaA.etiquetas.filter(etiqueta => notaB.etiquetas.includes(etiqueta));
                        if (etiquetasEnComun.length > 0 && !etiquetasRelacionadas[notaA.titulo + notaB.titulo]) {
                            edges.push({ from: notaA.titulo, to: notaB.titulo });
                            etiquetasRelacionadas[notaA.titulo + notaB.titulo] = true;
                            etiquetasRelacionadas[notaB.titulo + notaA.titulo] = true;
                        }
                    }
                }
            }
        }
    }

    network.setData(data);

    network.on("doubleClick", function (params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const nota = encontrarNotaPorTitulo(nodeId);
            if (nota) {

                const notaAlert = document.getElementById("NotaAlert");
                const fondoOscuro = document.getElementById("FondoOscuro");
                notaAlert.style.zIndex = 2;
            const mostrar = `
                            <h2 class="title">${nota.titulo}</h2>
                            <p class="content">${nota.contenido}</p>
                            <span class="Tags">Etiquetas: ${nota.etiquetas}</span>
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

            }
        }
    });
}

function encontrarNotaPorTitulo(titulo) {
    return notas.find(nota => nota.titulo === titulo);
}
  
export function destruirSesion() {
    sessionStorage.removeItem('username');
    window.location.href = 'login.html';
}