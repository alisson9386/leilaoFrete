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

class TipoProprietarioComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipoProprietarios : [],
      showModal: false,
      search: "",
      filteredTipoProprietarios: [],
      currentPage: 1,
      tipoProprietarioPerPage: 10,
      editTipoProprietario: {},
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

  confirmDeleteTipoProprietario = (tipoProprietario) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o tipo de proprietario ${tipoProprietario.tipo}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteTipoProprietario(tipoProprietario.id);
      }
    });
  };

  deleteStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Excluído!", "Tipo de proprietario excluído.", "success");
    } else {
      Swal.fire("Erro ao excluir!", `${message}`, "error");
    }
  };

  addStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Salvo!", "Tipo de proprietario salvo.", "success");
    } else {
      Swal.fire("Erro ao salvar!", `${message}`, "error");
    }
  };

  updateTipoProprietarioSuccess = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Atualizado!", "Tipo de proprietario atualizado.", "success");
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
    const responseTipoProprietario = await AppServices.listTipoProprietarios();
    if (responseTipoProprietario.data) {
      this.setState({ tipoProprietarios: responseTipoProprietario.data, filteredTipoProprietarios: responseTipoProprietario.data });
    }
  }

  filterTipoProprietarios = (search) => {
    const filteredTipoProprietarios = this.state.tipoProprietarios.filter((tipoProprietario) =>
    tipoProprietario.tipo.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredTipoProprietarios, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterTipoProprietarios(search);
  };

  handleDeleteProprietario = (proprietario) => {
    this.confirmDeleteTipoProprietario(proprietario);
  };

  handleEditTipoProprietario = (proprietario) => {
    this.handleShow(proprietario, "edit");
  };

  handleShow = (proprietarioData = {}, mode) => {
    this.setState({
      showModal: true,
      editTipoProprietario: proprietarioData,
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
      editTipoProprietario: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
      this.setState((prevState) => ({
        editTipoProprietario: {
          ...prevState.editTipoProprietario,
          [name]: value,
        },
      }));
  };

  editOrAddTipoProprietario = () => {
    const { editTipoProprietario, modalMode } = this.state;
    if (
      !editTipoProprietario.tipo_proprietario
    ) {
      Swal.fire({
        title: "Ops!",
        text: "É necessário preencher todos os campos!",
        icon: "error",
      });
      return;
    }

    AppServices.saveTipoProprietarios(editTipoProprietario)
      .then((res) => {
        if (res.status === 201) {
          Swal.close();
          if (modalMode === "add") {
            this.addStatus(true);
            this.handleClose();
          } else {
            this.updateTipoProprietarioSuccess(true);
            this.handleClose();
          }
        } else {
          Swal.close();
          this.updateTipoProprietarioSuccess(false, res.statusText);
        }
      })
      .catch((error) => {
        Swal.close();
        this.deleteStatus(false);
        console.log(error);
      });
  };

  serviceDeleteTipoProprietario = (idTipoProprietario) => {
    this.showLoading("Excluindo");
    AppServices.deleteTipoProprietarios(idTipoProprietario)
      .then((res) => {
        if (res.status === 200) {
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

  renderProprietarios = () => {
    const { currentPage, tipoProprietarioPerPage } = this.state;

    const indexOfLastProprietario = currentPage * tipoProprietarioPerPage;
    const indexOfFirstProprietario = indexOfLastProprietario - tipoProprietarioPerPage;
    const currentTipoProprietarios = this.state.filteredTipoProprietarios.slice(
      indexOfFirstProprietario,
      indexOfLastProprietario
    );

    return currentTipoProprietarios.map((tipoProprietario) => (
      <tr key={tipoProprietario.id}>
        <td>{tipoProprietario.id}</td>
        <td>{tipoProprietario.tipo_proprietario}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar proprietario"
            onClick={() => this.handleEditTipoProprietario(tipoProprietario)}
          >
            <BsFillPencilFill />
          </Button>{" "}
            <Button
              variant="danger"
              size="sm"
              title="Desativar"
              onClick={() => this.handleDeleteProprietario(tipoProprietario)}
            >
              <BsFillTrash3Fill />
            </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, tipoProprietarioPerPage } = this.state;
    const totalProprietarios = this.state.filteredTipoProprietarios.length;
    const totalPages = Math.ceil(totalProprietarios / tipoProprietarioPerPage);
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
    const { editTipoProprietario } = this.state;
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
          Novo tipo proprietario
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
                <th scope="col">Tipo</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>{this.renderProprietarios()}</tbody>
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
                ? "Adicionar tipo de proprietario"
                : "Editar tipo de proprietario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="tipo_proprietario"
                  name="tipo_proprietario"
                  label="Tipo de proprietario"
                  value={editTipoProprietario.tipo_proprietario || ""}
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
              onClick={this.editOrAddTipoProprietario}
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

export default TipoProprietarioComponent;

