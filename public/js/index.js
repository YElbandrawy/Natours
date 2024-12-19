import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';
import { renderMap } from './leaflet';
import { updateData } from './updateUserData';

//DOM elements
const leafletMap = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');

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

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
