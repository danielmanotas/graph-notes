
    const username = sessionStorage.getItem('username');
    if (username != null) {
        location.href = 'index.html';
    }

    const loginForm = document.getElementById('login');  

    loginForm.addEventListener('click', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username);

            const errorMessage = document.getElementById('error-message');
            if(!username){
                errorMessage.textContent = 'Debe Ingresar El Nombre de Usuario';
            }else if(!password){
                errorMessage.textContent = 'Debe Ingresar la Contraseña';
            }else{
                if (user) {
                    if (user.password === password) {
                        sessionStorage.setItem('username', username);
                        window.location.href = 'index.html';
                    } else {  
                    errorMessage.textContent = 'Contraseña Incorrecta';
                    }
                } else {
                    errorMessage.textContent = 'El Usuario Ingresado No Existe';
                }
            }
    });