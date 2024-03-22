import React, { Component } from "react";
import AppServices from "../../service/app-service";
import { Button, Form, Pagination } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import {
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsArrowCounterclockwise,
  BsEyeSlashFill,
  BsEyeFill,
} from "react-icons/bs";
import { MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";

class UsuariosEditComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarios: [],
      tipoUsuarios: [],
      showModal: false,
      buttonPassword: true,
      showPassword: false,
      showPasswordFields: false,
      search: "",
      filteredUsuarios: [],
      currentPage: 1,
      usuariosPerPage: 10,
      editUser: {},
      modalMode: "add",
    };
  }

  showLoading = (text) => {
    Swal.fire({
      title: "Aguarde!",
      html: text, // add html attribute if you want or remove
      allowOutsideClick: false,
      allowEscapeKey: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  confirmDeleteUser = (user) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a desativar o usuário ${user.usuario}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteUser(user.id);
      }
    });
  };

  deleteStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Excluído!", "Usuário excluído.", "success");
    } else {
      Swal.fire("Erro ao excluir!", `${message}`, "error");
    }
  };

  addStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Salvo!", "Usuário salvo.", "success");
    } else {
      Swal.fire("Erro ao salvar!", `${message}`, "error");
    }
  };

  updateUsuarioSuccess = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Atualizado!", "Usuário atualizado.", "success");
    } else {
      Swal.fire("Erro ao atualizar!", `${message}`, "error");
    }
  };

  showAlertError = (err) => {
    Swal.fire({
      icon: "error",
      title: "Erro, por favor contate o administrador!",
      text: err,
    });
  };

  async componentDidMount() {
    const responseTipoUser = await AppServices.listTipoUser();
    if (responseTipoUser.data) {
      this.setState({ tipoUsuarios: responseTipoUser.data });
    }
    const users = await AppServices.listUsers();
    if (users.data) {
      let usuarios = users.data;
      // eslint-disable-next-line
      usuarios.map((user) => {
        const tipo = responseTipoUser.data.find(
          (tipos) => tipos.id === user.tipo_user
        );
        user.tipoUsuario = tipo;
        user.senha = "";
      });
      this.setState({ usuarios: usuarios, filteredUsuarios: usuarios });
    }
  }

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterUsuarios(search);
  };

  filterUsuarios = (search) => {
    const filteredUsuarios = this.state.usuarios.filter((usuario) =>
      usuario.nome.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredUsuarios, currentPage: 1 });
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  togglePasswordFields = () => {
    this.setState({ showPasswordFields: true, buttonPassword: false });
  };

  handleDeleteUsuario = (user) => {
    this.confirmDeleteUser(user);
  };

  handleEditUsuario = (user) => {
    this.handleShow(user, "edit");
  };

  handleShow = (userData = {}, mode) => {
    this.setState({
      showModal: true,
      editUser: userData,
      modalMode: mode,
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
      buttonPassword: true,
      showPasswordFields: false,
      senha: "",
      senhaConfirm: "",
      editUser: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "tipoUsuario") {
      const tipoUsuarioSelecionado = this.state.tipoUsuarios.find(
        (tipo) => tipo.tipo === value
      );
      if (tipoUsuarioSelecionado !== undefined) {
        this.setState((prevState) => ({
          editUser: {
            ...prevState.editUser,
            tipoUsuario: tipoUsuarioSelecionado ? tipoUsuarioSelecionado : null,
            tipo_user: tipoUsuarioSelecionado.id
              ? tipoUsuarioSelecionado.id
              : null,
          },
        }));
      } else {
        this.setState((prevState) => ({
          editUser: {
            ...prevState.editUser,
            tipoUsuario: null,
            tipo_user: null,
          },
        }));
      }
    } else {
      this.setState((prevState) => ({
        editUser: {
          ...prevState.editUser,
          [name]: value,
        },
      }));
    }
  };

  editOrAddUser = () => {
    const { editUser, modalMode } = this.state;
    if (
      !editUser.nome ||
      !editUser.usuario ||
      !editUser.email ||
      !editUser.tipo_user ||
      modalMode === "add"
        ? !editUser.senha
        : ""
    ) {
      Swal.fire({
        title: "Ops!",
        text: "É necessário preencher todos os campos!",
        icon: "error",
      });
      return;
    }

    AppServices.saveUser(editUser)
      .then((res) => {
        if (res.status === 201) {
          Swal.close();
          if (modalMode === "add") {
            this.addStatus(true);
            this.handleClose();
          } else {
            this.updateUsuarioSuccess(true);
            this.handleClose();
          }
        } else {
          Swal.close();
          this.updateProprietarioSuccess(false, res.statusText);
        }
      })
      .catch((error) => {
        Swal.close();
        this.deleteStatus(false);
        console.log(error);
      });
  };

  serviceDeleteUser = (idUser) => {
    this.showLoading("Excluindo");
    AppServices.deleteUser(idUser)
      .then((res) => {
        if (res.data.message === "Usuário desativado com sucesso") {
          Swal.close();
          this.deleteStatus(true);
        } else {
          Swal.close();
          this.deleteStatus(false, res.data.message);
        }
      })
      .catch((error) => {
        Swal.close();
        this.deleteStatus(false);
        console.log(error);
      });
  };

  renderUsuarios = () => {
    const { currentPage, usuariosPerPage } = this.state;

    const indexOfLastUsuario = currentPage * usuariosPerPage;
    const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
    const currentUsuarios = this.state.filteredUsuarios.slice(
      indexOfFirstUsuario,
      indexOfLastUsuario
    );

    return currentUsuarios.map((user) => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.nome}</td>
        <td>{user.usuario}</td>
        <td>{user.email}</td>
        <td>{user.tipoUsuario.tipo}</td>
        <td>{user.fl_ativo ? "Ativo" : "Inativo"}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar usuário"
            onClick={() => this.handleEditUsuario(user)}
          >
            <BsFillPencilFill />
          </Button>{" "}
          {user.fl_ativo ? (
            <Button
              variant="danger"
              size="sm"
              title="Desativar"
              onClick={() => this.handleDeleteUsuario(user)}
            >
              <BsFillTrash3Fill />
            </Button>
          ) : (
            <Button variant="secondary" size="sm" title="Ativar">
              <BsArrowCounterclockwise />
            </Button>
          )}
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, usuariosPerPage } = this.state;
    const totalUsuarios = this.state.filteredUsuarios.length;
    const totalPages = Math.ceil(totalUsuarios / usuariosPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => this.setState({ currentPage: number })}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <>
        <div>
          <Pagination>{items}</Pagination>
        </div>
      </>
    );
  };

  render() {
    const { tipoUsuarios, editUser } = this.state;
    const passwordType = this.state.showPassword ? "text" : "password";
    return (
      <>
        <br />
        <Button
          variant="primary"
          size="sm"
          data-toggle="tooltip"
          id="termosButton"
          data-placement="right"
          onClick={() => this.handleShow({}, "add")}
        >
          Novo usuário
        </Button>
        <br />
        <br />
        <Form.Control
          type="text"
          placeholder="Pesquisar por nome"
          value={this.state.search}
          onChange={this.handleSearchChange}
        />
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover table-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Usuário</th>
                <th scope="col">Email</th>
                <th scope="col">Tipo de usuário</th>
                <th scope="col">Status</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>{this.renderUsuarios()}</tbody>
          </table>
        </div>
        <div>{this.renderPagination()}</div>

        <Modal
          className="modal modal-lg"
          show={this.state.showModal}
          onHide={this.handleClose}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.modalMode === "add"
                ? "Adicionar usuário"
                : "Editar usuário"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="nomw"
                  name="nome"
                  label="Nome"
                  value={editUser.nome || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="email"
                  name="email"
                  label="Email"
                  value={editUser.email || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBRow className="g-2">
                <MDBCol sm="5">
                  <MDBInput
                    id="user"
                    name="usuario"
                    label="Usuário"
                    value={editUser.usuario || ""}
                    onChange={this.handleInputChange}
                  />
                </MDBCol>
                <MDBCol sm="5">
                  <select
                    className="form-control"
                    name="tipoUsuario"
                    value={
                      editUser.tipoUsuario ? editUser.tipoUsuario.tipo : ""
                    }
                    onChange={this.handleInputChange}
                  >
                    <option>Selecione uma função</option>
                    {tipoUsuarios.map((option, index) => (
                      <option key={index} value={option.tipo}>
                        {option.tipo}
                      </option>
                    ))}
                  </select>
                </MDBCol>
              </MDBRow>
              <MDBRow className="g-2">
                <MDBCol sm="5">
                  <MDBInput
                    id="senha"
                    name="senha"
                    label="Senha"
                    type={passwordType}
                    onChange={this.handleInputChange}
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
              </MDBRow>
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              id="termosButton"
              data-toggle="modal"
              onClick={this.editOrAddUser}
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

export default UsuariosEditComponent;
