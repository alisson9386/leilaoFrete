import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import logo from "../assets/img/logo-buritti.png";
import useAlerts from "../context/useAlerts";
import useAuth from "../context/useAuth";
import history from "../history";
import BackService from "../service/app-service";

const LoginComponent = () => {
 const [usuario, setUsuario] = useState('');
 const [senha, setSenha] = useState('');

 const changeUserHandler = (event) => {
    setUsuario(event.target.value);
 };

 const changePasswordHandler = (event) => {
    setSenha(event.target.value);
 };

 const loginExecute = (e) => {
    e.preventDefault();
    const user = {
      usuario,
      senha,
    };
    if (!user.usuario || user.usuario === "" || !user.senha || user.senha === "") {
      useAlerts.showAlertUserEmpty();
      return;
    }
    let validation;

    BackService.loginUser(user)
      .then((res) => {
        validation = res.data;
        useAuth.handleLogin(validation);
        history.push("/index");
        useAlerts.showAlertUserAuthenticated();
      })
      .catch((err) => {
        useAlerts.showAlertErrorLogin(err);
        return;
      });
 };

 const toReplacePassword = () => {
    history.push("/replacePassword");
 };

 useEffect(() => {
    const token = Cookies.get("token");
    if (token != null) {
      history.push("/index");
    }
 }, []);

 return (
    <div className="page">
      <form method="POST" className="formLogin">
        <img
          src={logo}
          className="img-thumbnail"
          alt="..."
          width="150"
          height="150"
          style={{ borderRadius: "50%", margin: "auto" }}
        ></img>
        <h6 id="centralized-text">Leilão de fretes</h6>
        <p>Digite os seus dados de acesso no campo abaixo.</p>
        <label htmlFor="usuario">Usuario</label>
        <input
          type="text"
          id="usuario"
          placeholder="Digite seu usuario"
          value={usuario}
          onChange={changeUserHandler}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={changePasswordHandler}
          placeholder="Digite sua senha"
        />
        <Button onClick={loginExecute} className="btn">
          Acessar
        </Button>
        <Button
          onClick={toReplacePassword}
          className="btn btn-secondary ml-2"
        >
          Esqueci minha senha
        </Button>
      </form>
    </div>
 );
};

export default LoginComponent;