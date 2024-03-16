import React, { Component } from 'react'
import Cookies from 'js-cookie';
import { isExpired, decodeToken } from 'react-jwt';
import useAuth from '../context/useAuth';
import AppServices from '../service/app-service'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class PerfilComponent extends Component {

    showLoading = (text) => {
        Swal.fire({
            title: 'Aguarde !',
            html: text,// add html attribute if you want or remove
            allowOutsideClick: false,
            allowEscapeKey: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            },
        });
    }

    updateUserSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Usuário atualizado!',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000
        })
        return;
    }

    showAlertError = (err) => {
        Swal.fire({
            icon: 'error',
            title: 'Erro, por favor contate o administrador!',
            text: err
        })
    }

    constructor(props) {
        super(props)

        this.state = {
            id: '',
            tipo_user: '',
            tipo_user_id: '',
            usuario: '',
            senha: '',
            senhaConfirm: '',
            nome: '',
            email: '',
            tipoUsuarios: [],
            showModal: false
        }

        this.changeTipoUserHandler = this.changeTipoUserHandler.bind(this);
        this.changeUserHandler = this.changeUserHandler.bind(this);
        this.changeSenhaHandler = this.changeSenhaHandler.bind(this);
        this.changeSenhaConfirmHandler = this.changeSenhaConfirmHandler.bind(this);
        this.changeNomeHandler = this.changeNomeHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
    }


    handleClose = () => {
        this.setState({ showModal: false });
        this.componentDidMount();
    }

    handleShow = () => {
        this.setState({ showModal: true });
    }

    handleEditPerfil = () => {
        this.handleShow();

    }

    async componentDidMount() {
        try {
            const token = Cookies.get('token');
            const myDecodedToken = decodeToken(token);
            const isMyTokenExpired = isExpired(token);
            if (isMyTokenExpired) {
                useAuth.handleLogout();
            } else if (!isMyTokenExpired) {
                this.setState({ id: myDecodedToken.user.id });
                this.setState({ usuario: myDecodedToken.user.usuario });
                this.setState({ nome: myDecodedToken.user.nome });
                this.setState({ email: myDecodedToken.user.email });
                const responseTipoUser = await AppServices.listTipoUser();
                if (responseTipoUser.data != null) {
                    this.setState({ tipoUsuarios: responseTipoUser.data });
                }
                const tipo = responseTipoUser.data.find((tipos) => tipos.id === myDecodedToken.user.tipo_user);
                this.setState({ tipo_user: tipo.tipo })
                this.setState({ tipo_user_id: tipo.id })
            }

        } catch (error) {
            console.log(error);
        }

    }

    changeTipoUserHandler = (event) => {
        this.setState({ tipo_user: event.target.value });
    }
    changeUserHandler = (event) => {
        this.setState({ usuario: event.target.value });
    }
    changeSenhaHandler = (event) => {
        this.setState({ senha: event.target.value });
    }
    changeSenhaConfirmHandler = (event) => {
        this.setState({ senhaConfirm: event.target.value });
    }
    changeNomeHandler = (event) => {
        this.setState({ nome: event.target.value });
    }
    changeEmailHandler = (event) => {
        this.setState({ email: event.target.value });
    }

    getSetorETipoUser = (tipoUser) => {
        const tipo = this.state.tipoUsuarios.find((tipos) => tipos.id === tipoUser);
        this.setState({ tipo_user: tipo.tipo })
        this.setState({ tipo_user_id: tipo.id })
    }

    editarPerfil = async () => {
        this.showLoading('Salvando alterações');
        console.log(this.state)
        let senha = '';
        if (this.state.senha !== '' && this.state.senhaConfirm !== '' && this.state.senha === this.state.senhaConfirm) {
            senha = this.state.senha;
        }
        const tipoUser = this.state.tipoUsuarios.find((tipos) => tipos.tipo === this.state.tipo_user);
        const user = {
            'nome': this.state.nome,
            'usuario': this.state.usuario,
            'senha': senha,
            'email': this.state.email,
            'tipo_user': tipoUser.id,
        }

        let id = this.state.id;

        const updateUser = await AppServices.updateUser(user, id);
            if (updateUser.status === 200) {
                this.updateUserSuccess();
                this.handleClose();
                window.location.reload();
            }else{
                console.log(updateUser.statusText);
                this.showAlertError(updateUser.statusText)

            }
    }

    render() {
        const { tipoUsuarios, tipo_user } = this.state;
        return (
            <>
                <br /><br /><br /><br /><br />
                <div className='containerPerfilView'>
                    <h3>Meu perfil</h3><br />
                    <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.nome}
                            disabled="disabled"
                            placeholder="Nome"
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.email}
                            disabled="disabled"
                            placeholder="Email"
                        />
                        </Form.Group>
                        <Form.Group as={Col} md="2">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Usuário"
                            value={this.state.usuario}
                            disabled="disabled"
                        />
                        </Form.Group>
                        <Form.Group as={Col} md="2">
                        <Form.Label>Tipo de usuário</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.tipo_user}
                            disabled="disabled"
                            placeholder="Email"
                        />
                        </Form.Group>
                    </Row>
                    <Button 
                    type="button"
                    className='btn btn-dark'
                    onClick={() => this.handleEditPerfil()}
                    >Editar perfil</Button>
                    </Form>
                </div>
                <Modal className='modal modal-lg' show={this.state.showModal} onHide={this.handleClose} dialogClassName="custom-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>Editar perfil</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='containerPerfilEdit'>
                            <form onSubmit={this.editarPerfil}>
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label>Nome</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="Nome"
                                                value={this.state.nome}
                                                onChange={this.changeNomeHandler}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email"
                                                className="form-control"
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                placeholder="Seu email"
                                                value={this.state.email}
                                                onChange={this.changeEmailHandler}
                                                disabled={this.state.tipo_user_id !== 1}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Usuário</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="Usuário"
                                                value={this.state.usuario}
                                                onChange={this.changeUserHandler}
                                                disabled={this.state.tipo_user_id !== 1}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Tipo de usuário</label>
                                            <select className="form-control" value={tipo_user} onChange={this.changeTipoUserHandler} disabled={this.state.tipo_user_id !== 1}>
                                                {/* Mapeia o array de opções e cria as opções do select */}
                                                {tipoUsuarios.map((option, index) => (
                                                    <option key={index} value={option.tipo}>
                                                        {option.tipo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row g-3">
                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label>Senha</label>
                                            <input type="password"
                                                className="form-control"
                                                placeholder="Senha"
                                                value={this.state.senha}
                                                onChange={this.changeSenhaHandler}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        <div className="form-group">
                                            <label>Confirme sua senha</label>
                                            <input type="password"
                                                className="form-control"
                                                placeholder="Confirme sua senha"
                                                value={this.state.senhaConfirm}
                                                onChange={this.changeSenhaConfirmHandler}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" id="termosButton" data-toggle="modal" onClick={this.editarPerfil}>Salvar</Button>
                        <span style={{ marginLeft: '10px' }}></span>
                        <Button variant="danger" onClick={this.handleClose}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default PerfilComponent;