export const createNotes = `
    <div class="app-container">
        <aside class="side-bar">
            <h1>GRAPH NOTES</h1>
            <div class="form-container">
                <label for="titulo">Título:</label>
                <input type="text" id="titulo" maxlength="100">
                <label for="contenido">Contenido:</label>
                <textarea id="contenido" rows="20" maxlength="20000"></textarea>
                <label for="etiquetas">Etiquetas (separadas por comas):</label>
                <input type="text" id="etiquetas" list="etiquetasDatalist" maxlength="100">
                <datalist id="etiquetasDatalist" >
                 </datalist>
                <button id="save-button">Guardar Nota</button>
            </div>
        </aside>  
    </div>
`;

export const viewNotes = `
    <div class="main-content"> 
    <div id="notas">
        <ul id="notas-list"></ul>
    </div>
    </div>
`; 


export const graph = `
    <div id="grafo"></div>
    <span id="grafo-container"></span>
`;


export const login = `<div class="login-container">
                    <h1>Graph Notes</h1>
                    <h2>Iniciar sesión</h2>
                    <form id="login-form">
                        <input type="text" id="username" placeholder="Usuario" required>
                        <input type="password" id="password" placeholder="Contraseña" required>
                        <button type="submit">Iniciar sesión</button>
                        <a href="registro.html">Registrarse</a>
                    </form>
                    <p id="error-message"></p>
                    </div>
`;

export const registro = `<div class="login-container">
                    <h1>Graph Notes</h1>
                    <h2>Registrarse</h2>
                    <form id="login-form">
                        <input type="text" id="Name" placeholder="Nombre" required>
                        <input type="text" id="lastname" placeholder="Apellido" required>
                        <input type="text" id="username" placeholder="Username" required>
                        <input type="password" id="password" placeholder="Contraseña" required>
                        <button type="submit">Registrarse</button>
                        <a href="login.html">Iniciar Sesión</a>
                    </form>
                    <p id="error-message"></p>   
                    </div>
`;