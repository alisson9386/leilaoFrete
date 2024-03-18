import React, { Component } from "react";
import useAuth from "../context/useAuth";
import AppServices from "../service/app-service";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import imgPerfil from "../assets/img/perfil.png";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBInput,
} from "mdb-react-ui-kit";

class PerfilComponent extends Component {
  showLoading = (text) => {
    Swal.fire({
      title: "Aguarde !",
      html: text, // add html attribute if you want or remove
      allowOutsideClick: false,
      allowEscapeKey: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  updateUserSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Usuário atualizado!",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 3000,
    });
    return;
  };

  showAlertError = (err) => {
    Swal.fire({
      icon: "error",
      title: "Erro, por favor contate o administrador!",
      text: err,
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      id: "",
      tipo_user: "",
      tipo_user_id: "",
      usuario: "",
      senha: "",
      senhaConfirm: "",
      nome: "",
      email: "",
      tipoUsuarios: [],
      showModal: false,
      showPasswordFields: false,
      buttonPassword: true,
      showPassword: false,
    };

    this.changeTipoUserHandler = this.changeTipoUserHandler.bind(this);
    this.changeUserHandler = this.changeUserHandler.bind(this);
    this.changeSenhaHandler = this.changeSenhaHandler.bind(this);
    this.changeSenhaConfirmHandler = this.changeSenhaConfirmHandler.bind(this);
    this.changeNomeHandler = this.changeNomeHandler.bind(this);
    this.changeEmailHandler = this.changeEmailHandler.bind(this);
  }

  handleClose = () => {
    this.setState({
      showModal: false,
      buttonPassword: true,
      showPasswordFields: false,
      senha: "",
      senhaConfirm: "",
    });
    this.componentDidMount();
  };

  handleShow = () => {
    this.setState({ showModal: true });
  };

  handleEditPerfil = () => {
    this.handleShow();
  };

  togglePasswordFields = () => {
    this.setState({ showPasswordFields: true, buttonPassword: false });
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  async componentDidMount() {
    const myDecodedToken = useAuth.setAuthInfo();
    this.setState({ id: myDecodedToken.user.id });
    this.setState({ usuario: myDecodedToken.user.usuario });
    this.setState({ nome: myDecodedToken.user.nome });
    this.setState({ email: myDecodedToken.user.email });
    const responseTipoUser = await AppServices.listTipoUser();
    if (responseTipoUser.data != null) {
      this.setState({ tipoUsuarios: responseTipoUser.data });
    }
    const tipo = responseTipoUser.data.find(
      (tipos) => tipos.id === myDecodedToken.user.tipo_user
    );
    this.setState({ tipo_user: tipo.tipo });
    this.setState({ tipo_user_id: tipo.id });
  }

  changeTipoUserHandler = (event) => {
    this.setState({ tipo_user: event.target.value });
  };
  changeUserHandler = (event) => {
    this.setState({ usuario: event.target.value });
  };
  changeSenhaHandler = (event) => {
    this.setState({ senha: event.target.value });
  };
  changeSenhaConfirmHandler = (event) => {
    this.setState({ senhaConfirm: event.target.value });
  };
  changeNomeHandler = (event) => {
    this.setState({ nome: event.target.value });
  };
  changeEmailHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  getSetorETipoUser = (tipoUser) => {
    const tipo = this.state.tipoUsuarios.find((tipos) => tipos.id === tipoUser);
    this.setState({ tipo_user: tipo.tipo });
    this.setState({ tipo_user_id: tipo.id });
  };

  editarPerfil = async () => {
    this.showLoading("Salvando alterações");
    console.log(this.state);
    let senha = "";
    if (
      this.state.senha !== "" &&
      this.state.senhaConfirm !== "" &&
      this.state.senha === this.state.senhaConfirm
    ) {
      senha = this.state.senha;
    }
    const tipoUser = this.state.tipoUsuarios.find(
      (tipos) => tipos.tipo === this.state.tipo_user
    );
    const user = {
      nome: this.state.nome,
      usuario: this.state.usuario,
      senha: senha,
      email: this.state.email,
      tipo_user: tipoUser.id,
    };

    let id = this.state.id;

    const updateUser = await AppServices.updateUser(user, id);
    if (updateUser.status === 200) {
      this.updateUserSuccess();
      this.handleClose();
      window.location.reload();
    } else {
      console.log(updateUser.statusText);
      this.showAlertError(updateUser.statusText);
    }
  };

  render() {
    const { tipoUsuarios, tipo_user } = this.state;
    const passwordType = this.state.showPassword ? "text" : "password";
    return (
      <>
        <br />
        <br />

        <div className="containerPerfilView">
          <MDBContainer className="container py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol md="12" xl="4">
                <MDBCard style={{ borderRadius: "15px" }}>
                  <MDBCardBody className="text-center">
                    <div className="mt-3 mb-4">
                      <MDBCardImage
                        src={imgPerfil}
                        className="rounded-circle"
                        fluid
                        style={{ width: "100px" }}
                      />
                    </div>
                    <MDBTypography tag="h4"> {this.state.nome}</MDBTypography>
                    <MDBCardText className="text-muted mb-4">
                      {this.state.usuario} <span className="mx-2">|</span>{" "}
                      <a href="#!">
                        {this.state.email} <span className="mx-2">|</span>{" "}
                      </a>
                      {this.state.tipo_user}
                    </MDBCardText>
                    <MDBBtn
                      rounded
                      size="lg"
                      onClick={() => this.handleEditPerfil()}
                    >
                      Editar Perfil
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          {/*<Form>
            <Row className="mb-3">
              <Form.Group as={Col} md="4">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.nome}
                  disabled="disabled"
                  placeholder="Nome"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.email}
                  disabled="disabled"
                  placeholder="Email"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
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
              className="btn btn-dark"
              onClick={() => this.handleEditPerfil()}
            >
              Editar perfil
            </Button>
    </Form>*/}
        </div>
        <Modal
          className="modal modal-lg"
          show={this.state.showModal}
          onHide={this.handleClose}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Editar perfil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="nomw"
                  label="Nome"
                  value={this.state.nome}
                  onChange={this.changeNomeHandler}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="email"
                  onChange={this.changeEmailHandler}
                  label="Email"
                  value={this.state.email}
                />
              </MDBCol>
              <MDBRow className="g-2">
                <MDBCol sm="5">
                  <MDBInput
                    onChange={this.changeUserHandler}
                    id="user"
                    label="Usuário"
                    value={this.state.usuario}
                    disabled={this.state.tipo_user_id !== 1}
                  />
                </MDBCol>
                <MDBCol sm="5">
                  <select
                    className="form-control"
                    label="Tipo de usuário"
                    value={tipo_user}
                    onChange={this.changeTipoUserHandler}
                    disabled={this.state.tipo_user_id !== 1}
                  >
                    {tipoUsuarios.map((option, index) => (
                      <option key={index} value={option.tipo}>
                        {option.tipo}
                      </option>
                    ))}
                  </select>
                </MDBCol>
              </MDBRow>
              <MDBRow className="g-2">
                {this.state.buttonPassword && (
                  <MDBCol size="auto">
                    <Button
                      variant="primary"
                      id="termosButton"
                      data-toggle="modal"
                      onClick={this.togglePasswordFields}
                    >
                      Alterar senha?
                    </Button>
                  </MDBCol>
                )}
              </MDBRow>
              {this.state.showPasswordFields && (
                <MDBRow className="g-2">
                  <MDBCol sm="5">
                    <MDBInput
                      id="senha"
                      label="Senha"
                      type={passwordType}
                      value={this.state.senha}
                      onChange={this.changeSenhaHandler}
                    />
                  </MDBCol>
                  <MDBCol sm="5">
                    <MDBInput
                      id="confirmSenha"
                      type={passwordType}
                      label="Confirme a senha"
                      value={this.state.senhaConfirm}
                      onChange={this.changeSenhaConfirmHandler}
                    />
                  </MDBCol>
                  <MDBCol sm="2">
                    <Button
                      variant="primary"
                      id="termosButton"
                      data-toggle="modal"
                      onClick={this.toggleShowPassword}
                    >
                      {this.state.showPassword ? "Ocultar" : "Exibir"}
                    </Button>
                  </MDBCol>
                </MDBRow>
              )}
            </MDBRow>
            {/*<div className="containerPerfilEdit">
              <form onSubmit={this.editarPerfil}>
                <div className="row g-3">
                  <div className="col-md-5">
                    <div className="form-group">
                      <label>Nome</label>
                      <input
                        type="text"
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
                      <input
                        type="email"
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
                      <input
                        type="text"
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
                      <select
                        className="form-control"
                        value={tipo_user}
                        onChange={this.changeTipoUserHandler}
                        disabled={this.state.tipo_user_id !== 1}
                      >
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
                      <input
                        type="password"
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
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirme sua senha"
                        value={this.state.senhaConfirm}
                        onChange={this.changeSenhaConfirmHandler}
                      />
                    </div>
                  </div>
                </div>
              </form>
                        </div>*/}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              id="termosButton"
              data-toggle="modal"
              onClick={this.editarPerfil}
            >
              Salvar
            </Button>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="danger" onClick={this.handleClose}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default PerfilComponent;
