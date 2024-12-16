import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';
import { renderMap } from './leaflet';

//DOM elements
const leafletMap = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
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

if (logOutBtn) logOutBtn.addEventListener('click', logout);
