import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://natours-uosef.up.railway.app/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const signup = async (name, email, password, passwordconfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://natours-uosef.up.railway.app/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordconfirm,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async (email, password) => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://natours-uosef.up.railway.app/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'error loging out try again😅');
  }
};

export const forgotPassword = async (email) => {
  try {
    showAlert(
      'success',
      'Reset link should be sent if this E-mail linked to an account'
    );
    const res = await axios({
      method: 'POST',
      url: 'https://natours-uosef.up.railway.app/api/v1/users/forgotpassword',
      data: {
        email,
      },
    });
  } catch (error) {
    showAlert(
      'success',
      'Reset link should be sent if this E-mail linked to an account'
    );
  }
};
