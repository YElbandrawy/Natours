import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login, signup, logout, forgotPassword } from './login';
import { renderMap } from './leaflet';
import { updateData, resetPassword } from './updateUserData';
import { bookTour } from './stripe';

//DOM elements
const leafletMap = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const forgotPasswordform = document.querySelector('.form--forgotPassword');
const resetPasswordform = document.querySelector('.form--resetPassword');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

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

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateData(form, 'data');
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

if (forgotPasswordform) {
  forgotPasswordform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}
if (resetPasswordform) {
  resetPasswordform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordconfirm = document.getElementById('password-confirm').value;
    const resetToken = window.location.pathname.split('/')[2];
    resetPassword(password, passwordconfirm, resetToken);
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'processing';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
