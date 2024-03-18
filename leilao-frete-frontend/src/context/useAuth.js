import Cookies from "js-cookie";
import history from "../history";
import { isExpired, decodeToken } from "react-jwt";

class UseAuth {
  handleLogin(data) {
    Cookies.set("token", data.token);
  }

  handleLogout() {
    Cookies.remove("token");
    history.push("/");
  }

  decodeToken() {
    const token = Cookies.get("token");
    const myDecodedToken = decodeToken(token);
    const isMyTokenExpired = isExpired(token);
    if (!isMyTokenExpired) {
      return myDecodedToken;
    } else {
      this.handleLogout();
    }
  }

  setAuthInfo() {
    const decodedToken = decodeToken();
    var user = {
      id: decodedToken.user.id,
      user: decodedToken.user.usuario,
      nome: decodedToken.user.nome,
      email: decodedToken.user.email,
    };
    return user;
  }

  checkTokenExpiration() {
    this.tokenCheckInterval = setInterval(() => {
      const decodedToken = this.decodeToken();
      if (!decodedToken) {
        this.handleLogout();
      }
    }, 2 * 60 * 1000); // Verifica a cada 2 minutos
 }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UseAuth();
