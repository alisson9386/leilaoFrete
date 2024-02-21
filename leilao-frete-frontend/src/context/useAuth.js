import Cookies from 'js-cookie';
import history from '../history';

class UseAuth {

  handleLogin(data) {
    Cookies.set('token', data.token);
  }

  handleLogout() {
    Cookies.remove('token');
    history.push('/');
  }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UseAuth()