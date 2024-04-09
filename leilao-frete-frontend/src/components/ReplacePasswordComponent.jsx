import emailjs from 'emailjs-com';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import useAlerts from '../context/useAlerts';
import history from '../history';
import appServices from '../service/app-service';

const ReplacePasswordComponent = () => {
    const [usuario, setUsuario] = useState('');
    const [dadosUser, setDadosUser] = useState({});
    const [emailjsService, setEmailjsService] = useState('');
    const [emailjsTemplate, setEmailjsTemplate] = useState('');
    const [emailjsUser, setEmailjsUser] = useState('');

    useEffect(() => {
        setEmailjsService(process.env.REACT_APP_SERVICE_ID);
        setEmailjsTemplate(process.env.REACT_APP_TEMPLATE_ID);
        setEmailjsUser(process.env.REACT_APP_USER_ID);
    }, []);

    const changeUserHandler = (event) => {
        setUsuario(event.target.value);
    };

    const toLogin = () => {
        history.push("/");
    };

    const sendEmailAndModifiedUser = () => {
        const randomPassword = Math.random().toString(36).substr(2, 8);
        const updatedDadosUser = { ...dadosUser, senha: randomPassword };
        const templateParams = {
            nome: dadosUser.nome,
            email: dadosUser.email,
            senha: randomPassword
        };
        console.log(updatedDadosUser);
        appServices.updateUser(updatedDadosUser, dadosUser.id).then().catch((err) => {
            useAlerts.showAlertErrorReplace(err);
            return;
        });
        emailjs.send(
            emailjsService,
            emailjsTemplate,
            templateParams,
            emailjsUser
        )
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });

        return true;
    };

    const replaceMain = () => {
        useAlerts.showLoading('Enviando senha para o email cadastrado');
        appServices.getUser(usuario).then((res) => {
            setDadosUser(res.data);
            let confirmEmailAndPersist = sendEmailAndModifiedUser();
            if (confirmEmailAndPersist) {
                useAlerts.showAlertEmailSend();
            } else {
                useAlerts.showAlertErrorReplace();
            }
        }).catch((err) => {
            useAlerts.showAlertErrorReplace(err);
            return;
        });
    };

    return (
        <div className="page">
            <form method="POST" className="formLogin">
                <h1>Recuperar senha</h1>
                <p>Digite os dados necessários para recuperação</p>
                <label htmlFor="usuario">Usuario</label>
                <input type="text" id="usuario" placeholder="Digite seu usuario" value={usuario} onChange={changeUserHandler} />
                <Button onClick={replaceMain} className="btn">Recuperar</Button>
                <Button onClick={toLogin} className="btn btn-secondary ml-2">Voltar</Button>
            </form>
        </div>
    );
};

export default ReplacePasswordComponent;