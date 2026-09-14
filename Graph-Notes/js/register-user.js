import { readArray } from '../modules/notes.js';

const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
form.addEventListener('submit', event => {
  event.preventDefault();
  errorMessage.textContent = '';
  try {
    const name = document.getElementById('Name').value;
    const lastName = document.getElementById('lastname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (![name, lastName, username, password].every(value => value.trim())) {
      throw new Error('Completa todos los campos.');
    }
    const users = readArray(localStorage, 'users');
    if (users.some(user => user.username === username)) {
      throw new Error('El usuario ya está registrado. Inicia sesión.');
    }
    // Academic demo only; real authentication requires a backend.
    localStorage.setItem('users', JSON.stringify([...users, { name, lastName, username, password }]));
    location.href = 'login.html';
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
