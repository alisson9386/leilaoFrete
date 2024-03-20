import React, { Component } from "react";
import AppServices from "../../service/app-service";
import { Button, Form, Pagination } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
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
    };
  }

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

  handleEditUsuario = () => {
    this.handleShow();
  };

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

  renderUsuarios = () => {
    const { currentPage, usuariosPerPage } = this.state;

    const indexOfLastUsuario = currentPage * usuariosPerPage;
    const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
    const currentUsuarios = this.state.filteredUsuarios.slice(
      indexOfFirstUsuario,
      indexOfLastUsuario
    );

    return currentUsuarios.map((option) => (
      <tr key={option.id}>
        <td>{option.id}</td>
        <td>{option.nome}</td>
        <td>{option.usuario}</td>
        <td>{option.email}</td>
        <td>{option.tipoUsuario.tipo}</td>
        <td>{option.fl_ativo ? "Ativo" : "Inativo"}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar usuário"
            onClick={() => this.handleEditUsuario()}
          >
            <BsFillPencilFill />
          </Button>{" "}
          {option.fl_ativo ? (
            <Button variant="danger" size="sm" title="Desativar">
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
    const { tipoUsuarios } = this.state;
    const passwordType = this.state.showPassword ? "text" : "password";
    return (
      <>
        <h3>Editar usuarios</h3>
        <Form.Control
          type="text"
          placeholder="Pesquisar por nome"
          value={this.state.search}
          onChange={this.handleSearchChange}
        />
        <div className="table-responsive">
        <table class="table table-striped table-bordered table-hover table-sm">
          <thead class="thead-dark">
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
            <Modal.Title>Editar usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput id="nomw" label="Nome" />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput id="email" label="Email" />
              </MDBCol>
              <MDBRow className="g-2">
                <MDBCol sm="5">
                  <MDBInput id="user" label="Usuário" />
                </MDBCol>
                <MDBCol sm="5">
                  <select className="form-control" label="Tipo de usuário">
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
                    <MDBInput id="senha" label="Senha" type={passwordType} />
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
              )}
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
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

export default UsuariosEditComponent;
