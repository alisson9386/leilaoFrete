import React, { Component } from "react";
import AppServices from "../../../service/app-service";
import { Button, Form, Pagination } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import {
  BsFillPencilFill,
  BsFillTrash3Fill,
} from "react-icons/bs";
import { MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";
import useAlerts from "../../../context/useAlerts";

class TipoUsuariosComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipoUsuarios : [],
      showModal: false,
      search: "",
      filteredTipoUsuarios: [],
      currentPage: 1,
      tipoUserPerPage: 10,
      editTipoUser: {},
      modalMode: "add",
    };
  }

  confirmDeleteTipoUser = (tipoUser) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o tipo de usuário ${tipoUser.tipo}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteTipoUser(tipoUser.id);
      }
    });
  };

  async componentDidMount() {
    const responseTipoUser = await AppServices.listTipoUser();
    if (responseTipoUser.data) {
      this.setState({ tipoUsuarios: responseTipoUser.data, filteredTipoUsuarios: responseTipoUser.data });
    }
  }

  filterTipoUsuarios = (search) => {
    const filteredTipoUsuarios = this.state.tipoUsuarios.filter((tipoUser) =>
    tipoUser.tipo.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredTipoUsuarios, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterTipoUsuarios(search);
  };

  handleDeleteUsuario = (user) => {
    this.confirmDeleteTipoUser(user);
  };

  handleEditTipoUsuario = (user) => {
    this.handleShow(user, "edit");
  };

  handleShow = (userData = {}, mode) => {
    this.setState({
      showModal: true,
      editTipoUser: userData,
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
      editTipoUser: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
      this.setState((prevState) => ({
        editTipoUser: {
          ...prevState.editTipoUser,
          [name]: value,
        },
      }));
  };

  editOrAddTipoUser = () => {
    const { editTipoUser, modalMode } = this.state;
    if (
      !editTipoUser.tipo
    ) {
      useAlerts.alertCamposObrigatorios();
      return;
    }

    AppServices.saveTipoUser(editTipoUser)
      .then((res) => {
        if (res.status === 201) {
          Swal.close();
          if (modalMode === "add") {
            useAlerts.addStatus(true);
            this.handleClose();
            this.componentDidMount();
          } else {
            useAlerts.updateSuccess(true);
            this.handleClose();
            this.componentDidMount();
          }
        } else {
          Swal.close();
          useAlerts.updateSuccess(false, res.statusText);
          this.componentDidMount();
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.deleteStatus(false);
        console.log(error);
        this.componentDidMount();
      });
  };

  serviceDeleteTipoUser = (idTipoUser) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteTipoUser(idTipoUser)
      .then((res) => {
        Swal.close();
        if (res.status === 200) {
          useAlerts.deleteStatus(true);
          this.componentDidMount();
        } else {
          useAlerts.deleteStatus(false, res.data.message);
          this.componentDidMount();
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.deleteStatus(false);
        console.log(error);
        this.componentDidMount();
      });
  };

  renderUsuarios = () => {
    const { currentPage, tipoUserPerPage } = this.state;

    const indexOfLastUsuario = currentPage * tipoUserPerPage;
    const indexOfFirstUsuario = indexOfLastUsuario - tipoUserPerPage;
    const currentTipoUsuarios = this.state.filteredTipoUsuarios.slice(
      indexOfFirstUsuario,
      indexOfLastUsuario
    );

    return currentTipoUsuarios.map((tipoUser) => (
      <tr key={tipoUser.id}>
        <td>{tipoUser.id}</td>
        <td>{tipoUser.tipo}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar"
            onClick={() => this.handleEditTipoUsuario(tipoUser)}
          >
            <BsFillPencilFill />
          </Button>{" "}
            <Button
              variant="danger"
              size="sm"
              title="Desativar"
              onClick={() => this.handleDeleteUsuario(tipoUser)}
            >
              <BsFillTrash3Fill />
            </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, tipoUserPerPage } = this.state;
    const totalUsuarios = this.state.filteredTipoUsuarios.length;
    const totalPages = Math.ceil(totalUsuarios / tipoUserPerPage);
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
    const { editTipoUser } = this.state;
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
          Novo tipo usuário
        </Button>
        <br />
        <br />
        <Form.Control
          type="text"
          placeholder="Pesquisar por tipo"
          value={this.state.search}
          onChange={this.handleSearchChange}
        />
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover table-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tipo</th>
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
                ? "Adicionar tipo de usuário"
                : "Editar tipo de usuário"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="tipo"
                  name="tipo"
                  label="Tipo de usuário"
                  value={editTipoUser.tipo || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              id="termosButton"
              data-toggle="modal"
              onClick={this.editOrAddTipoUser}
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

export default TipoUsuariosComponent;
