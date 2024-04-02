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

class TipoCarroceriaComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipoCarrocerias : [],
      showModal: false,
      search: "",
      filteredTipoCarrocerias: [],
      currentPage: 1,
      tipoCarroceriaPerPage: 10,
      editTipoCarroceria: {},
      modalMode: "add",
    };
  }

  confirmDeleteTipoCarroceria = (tipoCarroceria) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o tipo de carroceria ${tipoCarroceria.tipo_carroceria}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteTipoCarroceria(tipoCarroceria.id);
      }
    });
  };

  async componentDidMount() {
    const responseTipoCarroceria = await AppServices.listTipoCarroceria();
    if (responseTipoCarroceria.data) {
      this.setState({ tipoCarrocerias: responseTipoCarroceria.data, filteredTipoCarrocerias: responseTipoCarroceria.data });
    }
  }

  filterTipoCarrocerias = (search) => {
    const filteredTipoCarrocerias = this.state.tipoCarrocerias.filter((tipoCarroceria) =>
    tipoCarroceria.tipo.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredTipoCarrocerias, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterTipoCarrocerias(search);
  };

  handleDeleteCarroceria = (carroceria) => {
    this.confirmDeleteTipoCarroceria(carroceria);
  };

  handleEditTipoCarroceria = (carroceria) => {
    this.handleShow(carroceria, "edit");
  };

  handleShow = (carroceriaData = {}, mode) => {
    this.setState({
      showModal: true,
      editTipoCarroceria: carroceriaData,
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
      editTipoCarroceria: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
      this.setState((prevState) => ({
        editTipoCarroceria: {
          ...prevState.editTipoCarroceria,
          [name]: value,
        },
      }));
  };

  editOrAddTipoCarroceria = () => {
    const { editTipoCarroceria, modalMode } = this.state;
    if (
      !editTipoCarroceria.tipo_carroceria
    ) {
      useAlerts.alertCamposObrigatorios();
      return;
    }

    AppServices.saveTipoCarroceria(editTipoCarroceria)
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
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.deleteStatus(false);
        console.log(error);
        this.componentDidMount();
      });
  };

  serviceDeleteTipoCarroceria = (idTipoCarroceria) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteTipoCarroceria(idTipoCarroceria)
      .then((res) => {
        if (res.status === 200) {
          Swal.close();
          useAlerts.deleteStatus(true);
          this.componentDidMount();
        } else {
          Swal.close();
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

  renderCarrocerias = () => {
    const { currentPage, tipoCarroceriaPerPage } = this.state;

    const indexOfLastCarroceria = currentPage * tipoCarroceriaPerPage;
    const indexOfFirstCarroceria = indexOfLastCarroceria - tipoCarroceriaPerPage;
    const currentTipoCarrocerias = this.state.filteredTipoCarrocerias.slice(
      indexOfFirstCarroceria,
      indexOfLastCarroceria
    );

    return currentTipoCarrocerias.map((tipoCarroceria) => (
      <tr key={tipoCarroceria.id}>
        <td>{tipoCarroceria.id}</td>
        <td>{tipoCarroceria.tipo_carroceria}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar carroceria"
            onClick={() => this.handleEditTipoCarroceria(tipoCarroceria)}
          >
            <BsFillPencilFill />
          </Button>{" "}
            <Button
              variant="danger"
              size="sm"
              title="Desativar"
              onClick={() => this.handleDeleteCarroceria(tipoCarroceria)}
            >
              <BsFillTrash3Fill />
            </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, tipoCarroceriaPerPage } = this.state;
    const totalCarrocerias = this.state.filteredTipoCarrocerias.length;
    const totalPages = Math.ceil(totalCarrocerias / tipoCarroceriaPerPage);
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
    const { editTipoCarroceria } = this.state;
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
          Novo tipo carroceria
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
          <table className="table table-striped table-hover table-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tipo</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>{this.renderCarrocerias()}</tbody>
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
                ? "Adicionar tipo de carroceria"
                : "Editar tipo de carroceria"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="tipo_carroceria"
                  name="tipo_carroceria"
                  label="Tipo de carroceria"
                  value={editTipoCarroceria.tipo_carroceria || ""}
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
              onClick={this.editOrAddTipoCarroceria}
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

export default TipoCarroceriaComponent;
