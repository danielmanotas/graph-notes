    const registrationForm = document.getElementById('register');

    registrationForm.addEventListener('click', function (event) {
    event.preventDefault();

    const name = document.getElementById('Name').value;
    const lastName = document.getElementById('lastname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const errorMessage = document.getElementById('error-message');

    if (!name){
        errorMessage.textContent = 'Debe Ingresar El Nombre';
    }else if(!lastName){
        errorMessage.textContent = 'Debe Ingresar El Apellido';
    }else if(!username){
        errorMessage.textContent = 'Debe Ingresar El Nombre de Usuario';
    }else if(!password){
        errorMessage.textContent = 'Debe Ingresar la Contraseña';
    }else{

            const users = JSON.parse(localStorage.getItem('users')) || [];

            const existingUser = users.find(user => user.username === username);

            if (existingUser) {
                // const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'El usuario ya está registrado, Inicie Sesión';
            } else {
                const user = { name, lastName, username, password };
                users.push(user);

                localStorage.setItem('users', JSON.stringify(users));
                alert("Registrado Exitosamente");
                window.location.href = 'login.html';
            }
        }
    });