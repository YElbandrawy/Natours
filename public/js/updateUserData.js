import axios from 'axios';
import { showAlert } from './alerts';

//type is 'password' or 'data'
export const updateData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'https://natours-uosef.up.railway.app/api/v1/users/updatepassword'
        : 'https://natours-uosef.up.railway.app/api/v1/users/updateme';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
        if (type === 'password') {
          showAlert(
            'success',
            'Password Has changed successfuly, Please log in again'
          );
        }
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordconfirm, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `https://natours-uosef.up.railway.app/api/v1/users/resetpassword/${resetToken}`,
      data: {
        password,
        passwordconfirm,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/login');
        showAlert(
          'success',
          'Password Has changed successfuly, Please log in again'
        );
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
