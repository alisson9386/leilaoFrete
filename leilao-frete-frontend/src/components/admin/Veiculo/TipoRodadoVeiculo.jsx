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

class TipoRodadoVeiculoComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipoRodados : [],
      showModal: false,
      search: "",
      filteredTipoRodados: [],
      currentPage: 1,
      tipoRodadoPerPage: 10,
      editTipoRodado: {},
      modalMode: "add",
    };
  }

  confirmDeleteTipoRodado = (tipoRodado) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o tipo de rodado ${tipoRodado.tipo}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteTipoRodado(tipoRodado.id);
      }
    });
  };

  async componentDidMount() {
    const responseTipoRodado = await AppServices.listTipoRodado();
    if (responseTipoRodado.data) {
      this.setState({ tipoRodados: responseTipoRodado.data, filteredTipoRodados: responseTipoRodado.data });
    }
  }

  filterTipoRodados = (search) => {
    const filteredTipoRodados = this.state.tipoRodados.filter((tipoRodado) =>
    tipoRodado.tipo.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredTipoRodados, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterTipoRodados(search);
  };

  handleDeleteRodado = (rodado) => {
    this.confirmDeleteTipoRodado(rodado);
  };

  handleEditTipoRodado = (rodado) => {
    this.handleShow(rodado, "edit");
  };

  handleShow = (rodadoData = {}, mode) => {
    this.setState({
      showModal: true,
      editTipoRodado: rodadoData,
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
      editTipoRodado: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
      this.setState((prevState) => ({
        editTipoRodado: {
          ...prevState.editTipoRodado,
          [name]: value,
        },
      }));
  };

  editOrAddTipoRodado = () => {
    const { editTipoRodado, modalMode } = this.state;
    if (
      !editTipoRodado.tipo_rodado
    ) {
      useAlerts.alertCamposObrigatorios();
      return;
    }

    AppServices.saveTipoRodado(editTipoRodado)
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
          useAlerts.updateSuccess(false);
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

  serviceDeleteTipoRodado = (idTipoRodado) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteTipoRodado(idTipoRodado)
      .then((res) => {
        if (res.status === 200) {
          Swal.close();
          useAlerts.deleteStatus(true);
          this.componentDidMount();
        } else {
          Swal.close();
          useAlerts.deleteStatus(false);
          this.componentDidMount();
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.showAlertError(false);
        console.log(error);
        this.componentDidMount();
      });
  };

  renderRodados = () => {
    const { currentPage, tipoRodadoPerPage } = this.state;

    const indexOfLastRodado = currentPage * tipoRodadoPerPage;
    const indexOfFirstRodado = indexOfLastRodado - tipoRodadoPerPage;
    const currentTipoRodados = this.state.filteredTipoRodados.slice(
      indexOfFirstRodado,
      indexOfLastRodado
    );

    return currentTipoRodados.map((tipoRodado) => (
      <tr key={tipoRodado.id}>
        <td>{tipoRodado.id}</td>
        <td>{tipoRodado.tipo_rodado}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar rodado"
            onClick={() => this.handleEditTipoRodado(tipoRodado)}
          >
            <BsFillPencilFill />
          </Button>{" "}
            <Button
              variant="danger"
              size="sm"
              title="Desativar"
              onClick={() => this.handleDeleteRodado(tipoRodado)}
            >
              <BsFillTrash3Fill />
            </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, tipoRodadoPerPage } = this.state;
    const totalRodados = this.state.filteredTipoRodados.length;
    const totalPages = Math.ceil(totalRodados / tipoRodadoPerPage);
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
    const { editTipoRodado } = this.state;
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
          Novo tipo rodado
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
            <tbody>{this.renderRodados()}</tbody>
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
                ? "Adicionar tipo de rodado"
                : "Editar tipo de rodado"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="tipo_rodado"
                  name="tipo_rodado"
                  label="Tipo de rodado"
                  value={editTipoRodado.tipo_rodado || ""}
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
              onClick={this.editOrAddTipoRodado}
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

export default TipoRodadoVeiculoComponent;
