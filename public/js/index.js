import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, signup, logout } from './login';
import { renderMap } from './leaflet';
import { updateData } from './updateUserData';

//DOM elements
const leafletMap = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
if (leafletMap) {
  const locations = JSON.parse(leafletMap.dataset.locations);
  renderMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordconfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordconfirm);
  });
}
/*{
    "name":"uosefElbandrawy",
    "email":"uosef@GMail.com",
    "password":"pass1234",
    "passwordconfirm":"pass1234"
}*/

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData({ name, email }, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating....';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const passwordconfirm = document.getElementById('password-confirm').value;

    await updateData(
      { currentPassword, newPassword, passwordconfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    document.querySelector('.btn--save-password').textContent = 'Save password';
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logout);
