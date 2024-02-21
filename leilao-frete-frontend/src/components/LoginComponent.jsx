import React, { Component } from 'react'
import Swal from 'sweetalert2';
import useAuth from '../context/useAuth';
import BackService from '../service/app-service'
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import history from '../history';

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

class LoginComponent extends Component {
    showAlertUserEmpty = () => {
        Swal.fire({
                    icon: 'warning',
					title: 'Usuário e senha devem ser preenchidos',
						})	
    }
    showAlertErrorLogin = (err) => {
        Swal.fire({
                    icon: 'error',
					title: 'Falha no login',
                    html: err.message,
						})	
    }
    showAlertUserAuthenticated = () => {
        Toast.fire({
            icon: 'success',
            title: 'Acesso permitido',
						})	
    }
    constructor(props) {
        super(props)

        this.state = {
                usuario: '',
                senha:''
        }
        this.changeUserHandler = this.changeUserHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
    }

    changeUserHandler= (event) => {
        this.setState({usuario: event.target.value});
    }

    changePasswordHandler= (event) => {
        this.setState({senha: event.target.value});
    }

    loginExecute = (e) => {
        e.preventDefault();
        const user = {
            'usuario': this.state.usuario,
            'senha': this.state.senha
        }
        if(!user.usuario || user.usuario === '' || !user.senha || user.senha === ''){
            this.showAlertUserEmpty();
            return
        }
        let validation;

        BackService.loginUser(user).then((res) =>{
            validation = res.data;
            useAuth.handleLogin(validation);
            history.push('/index');
            this.showAlertUserAuthenticated();
        }).catch((err) =>{
            this.showAlertErrorLogin(err);
            return;
        });
    }

    toReplacePassword = () =>{
        history.push('/replacePassword');
    }

    componentDidMount() {
        const token = Cookies.get('token');
        if(token != null){
            history.push('/index');
        }
    }


    render() {

        return (
            <div className="page">
                <form method="POST" className="formLogin">
                    <h1>Login</h1>
                    <p>Digite os seus dados de acesso no campo abaixo.</p>
                    <label htmlFor="usuario">Usuario</label>
                    <input type="text" id="usuario" placeholder="Digite seu usuario" value={this.state.usuario} onChange={this.changeUserHandler} />
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="senha" value={this.state.senha} onChange={this.changePasswordHandler} placeholder="Digite sua senha" />
                    {/* <a href="/">Esqueci minha senha</a> */}
                    <Button onClick={this.loginExecute} className="btn">Acessar</Button>
                    <Button onClick={this.toReplacePassword} className="btn btn-secondary ml-2">Esqueci minha senha</Button>
                </form>
            </div>
        )

    }

}

export default LoginComponent;