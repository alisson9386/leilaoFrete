import React, { Component } from "react";
import useAuth from "../context/useAuth";
import AppServices from "../service/app-service";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import imgPerfil from "../assets/img/perfil.png";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
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
      erroSenha: "",
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
    this.setState({ id: myDecodedToken.id });
    this.setState({ usuario: myDecodedToken.usuario });
    this.setState({ nome: myDecodedToken.nome });
    this.setState({ email: myDecodedToken.email });
    const responseTipoUser = await AppServices.listTipoUser();
    if (responseTipoUser.data != null) {
      this.setState({ tipoUsuarios: responseTipoUser.data });
    }
    const tipo = responseTipoUser.data.find(
      (tipos) => tipos.id === myDecodedToken.tipo_user
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
    this.setState({ senha: event.target.value }, () => {
      this.validarSenhas();
    });
  };
  changeSenhaConfirmHandler = (event) => {
    this.setState({ senhaConfirm: event.target.value }, () => {
      this.validarSenhas();
    });
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

  validarSenhas = () => {
    const { senha, senhaConfirm } = this.state;
    if (senha !== senhaConfirm) {
      this.setState({ erroSenha: "As senhas não coincidem." });
    } else {
      this.setState({ erroSenha: "" });
    }
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
    const {
      tipoUsuarios,
      tipo_user,
      senha,
      senhaConfirm,
      erroSenha,
      showPasswordFields,
    } = this.state;
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
                      className="me-1"
                      color="secondary"
                      rounded
                      style={{ textTransform: 'none' }}
                      onClick={() => this.handleEditPerfil()}
                    >
                      Editar Perfil
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
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
                      variant="link"
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
                      value={senha}
                      onChange={this.changeSenhaHandler}
                    />
                  </MDBCol>
                  <MDBCol sm="5">
                    <MDBInput
                      id="confirmSenha"
                      type={passwordType}
                      label="Confirme a senha"
                      value={senhaConfirm}
                      onChange={this.changeSenhaConfirmHandler}
                    />
                  </MDBCol>
                  <MDBCol sm="2">
                    <Button
                      variant="link"
                      size="lg"
                      data-toggle="tooltip"
                      id="termosButton"
                      data-placement="right"
                      title={this.state.showPassword ? "Ocultar" : "Exibir"}
                      onClick={this.toggleShowPassword}
                    >
                      {this.state.showPassword ? (
                        <BsEyeSlashFill />
                      ) : (
                        <BsEyeFill />
                      )}
                    </Button>
                  </MDBCol>
                  {erroSenha && <p style={{ color: "red" }}>{erroSenha}</p>}
                </MDBRow>
              )}
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            {!showPasswordFields || (showPasswordFields && !erroSenha) ? (
              <Button
                variant="success"
                id="termosButton"
                data-toggle="modal"
                onClick={this.editarPerfil}
              >
                Salvar
              </Button>
            ) : (
              ""
            )}
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
