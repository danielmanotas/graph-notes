import { readArray } from '../modules/notes.js';

if (sessionStorage.getItem('username')) location.replace('index.html');

const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
form.addEventListener('submit', event => {
  event.preventDefault();
  errorMessage.textContent = '';
  try {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = readArray(localStorage, 'users').find(user => user.username === username);
    if (!username.trim() || !password) throw new Error('Completa el usuario y la contraseña.');
    if (!user || user.password !== password) throw new Error('Usuario o contraseña incorrectos.');
    sessionStorage.setItem('username', username);
    location.href = 'index.html';
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
