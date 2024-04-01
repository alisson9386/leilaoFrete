import React, { Component } from "react";
import AppServices from "../../../service/app-service";
import { Button, Form, Pagination } from "react-bootstrap";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";
import useAlerts from "../../../context/useAlerts";
import { faTruckField } from "@fortawesome/free-solid-svg-icons";

class VeiculoComponent extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      veiculosProprietario: [],
      showModal: false,
      search: "",
      filteredVeiculos: [],
      currentPage: 1,
      veiculoPerPage: 10,
      editVeiculo: {},
      modalMode: "add",
      ufs: [],
      tiposRodados: [],
      tiposCarroceria: [],
    };
  }
  
  confirmDeleteVeiculo = (veiculo) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a desativar o veículo de placa ${veiculo.placa}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteVeiculo(veiculo.id);
      }
    });
  };

  async componentDidMount() {
    const ufs = await AppServices.listUf();
    const tiposRodados = await AppServices.listTipoRodado();
    const tiposCarroceria = await AppServices.listTipoCarroceria();
    this.setState({
      ufs: ufs.data,
      tiposRodados: tiposRodados.data,
      tiposCarroceria: tiposCarroceria.data,
    });
    const veiculos = await AppServices.listVeiculosByProprietario(
      this.props.proprietarioId
    );
    if (veiculos.data) {
      let veic = veiculos.data;
      // eslint-disable-next-line
      veic.map((veiculo) => {
        const tipoRodado = tiposRodados.data.find(
          (tipos) => tipos.id === veiculo.tipo_rodado
        );
        const tipoCarroceria = tiposCarroceria.data.find(
          (tipos) => tipos.id === veiculo.tipo_carroceria
        );
        const uf = ufs.data.find(
          (tipos) => tipos.id === veiculo.uf_veiculo_licenciado
        );
        veiculo.uf = uf;
        veiculo.tipoRodado = tipoRodado;
        veiculo.tipoCarroceria = tipoCarroceria;
      });
      this.setState({
        veiculosProprietario: veic,
        filteredVeiculos: veic,
      });
    }
  }

  filterVeiculos = (search) => {
    const filteredVeiculos = this.state.veiculosProprietario.filter((veiculo) =>
      veiculo.placa.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredVeiculos, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterVeiculos(search);
  };

  handleDeleteVeiculo = (veiculo) => {
    this.confirmDeleteVeiculo(veiculo);
  };

  handleEditVeiculo = (veiculo) => {
    this.handleShow(veiculo, "edit");
  };

  handleShow = (veiculoData = {}, mode) => {
    this.setState({
      showModal: true,
      editVeiculo: veiculoData,
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
    const { name, type } = event.target;
    let value = type === "checkbox" ? event.target.checked : event.target.value;

    const findItem = (list, key) => list.find((item) => item[key] === value);

    const updateState = (field, item) => {
      this.setState((prevState) => ({
        editVeiculo: {
          ...prevState.editVeiculo,
          [field]: item ? item : null,
          [name]: item ? item.id : null,
        },
      }));
    };

    if (name === "tipo_rodado") {
      const tipoRodadoSelecionado = findItem(
        this.state.tiposRodados,
        "tipo_rodado"
      );
      updateState("tipoRodado", tipoRodadoSelecionado);
    } else if (name === "uf_veiculo_licenciado") {
      const tipoUfSelecionado = findItem(this.state.ufs, "uf");
      updateState("uf_veiculo_licenciado", tipoUfSelecionado.id);
      updateState("uf", tipoUfSelecionado);
    } else if (name === "tipo_carroceria") {
      const tipoCarroceriaSelecionado = findItem(
        this.state.tiposCarroceria,
        "tipo_carroceria"
      );
      updateState("tipoCarroceria", tipoCarroceriaSelecionado);
    } else {
      this.setState((prevState) => ({
        editVeiculo: {
          ...prevState.editVeiculo,
          [name]: value,
        },
      }));
    }
  };

  editOrAddVeiculo = () => {
    const { editVeiculo, modalMode } = this.state;
    if (!editVeiculo.placa || !editVeiculo.rntrc) {
      useAlerts.alertCamposObrigatorios();
      return;
    }

    editVeiculo.id_proprietario = this.props.proprietarioId;
    editVeiculo.placa = editVeiculo.placa.toUpperCase();
    AppServices.saveVeiculo(editVeiculo)
      .then((res) => {
        if (res.status === 201) {
          Swal.close();
          if (modalMode === "add") {
            useAlerts.addStatus(true);
            this.handleClose();
          } else {
            useAlerts.updateSuccess(true);
            this.handleClose();
          }
        } else {
          Swal.close();
          useAlerts.showAlertError(res.statusText);
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.addStatus(false, 'Veículo', error);
      });
  };

  serviceDeleteVeiculo = (idVeiculo) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteVeiculo(idVeiculo)
      .then((res) => {
        if (res.status === 200) {
          Swal.close();
          useAlerts.deleteStatus(faTruckField)
          this.componentDidMount();
        } else {
          Swal.close();
          useAlerts.deleteStatus(false, res.data.message)
          this.componentDidMount();
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.deleteStatus(false, error)
      });
  };

  renderVeiculos = () => {
    const { currentPage, veiculoPerPage } = this.state;

    const indexOfLastVeiculo = currentPage * veiculoPerPage;
    const indexOfFirstVeiculo = indexOfLastVeiculo - veiculoPerPage;
    const currentVeiculos = this.state.filteredVeiculos.slice(
      indexOfFirstVeiculo,
      indexOfLastVeiculo
    );

    return currentVeiculos.map((veiculo) => (
      <tr key={veiculo.id}>
        <td>{veiculo.placa}</td>
        <td>{veiculo.rntrc}</td>
        <td>{veiculo.tara_kg}</td>
        <td>{veiculo.capacidade_kg}</td>
        <td>{veiculo.capacidade_m3}</td>
        <td>{veiculo.capacidade_litros}</td>
        <td>{veiculo.uf.uf}</td>
        <td>{veiculo.tipoRodado.tipo_rodado}</td>
        <td>{veiculo.tipoCarroceria.tipo_carroceria}</td>
        <td>{veiculo.veiculo_proprio ? "Sim" : "Não"}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar veiculo"
            onClick={() => this.handleEditVeiculo(veiculo)}
          >
            <BsFillPencilFill />
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            title="Desativar"
            onClick={() => this.handleDeleteVeiculo(veiculo)}
          >
            <BsFillTrash3Fill />
          </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, tipoVeiculoPerPage } = this.state;
    const totalVeiculos = this.state.filteredVeiculos.length;
    const totalPages = Math.ceil(totalVeiculos / tipoVeiculoPerPage);
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
    const { editVeiculo, ufs, tiposRodados, tiposCarroceria } = this.state;
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
          Adicionar veículo
        </Button>
        <br />
        <br />
        <Form.Control
          type="text"
          placeholder="Pesquisar por placa"
          value={this.state.search}
          onChange={this.handleSearchChange}
        />
        <div className="table-responsive">
          <table className="table table-striped table-hover table-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Placa</th>
                <th scope="col">RNTRC</th>
                <th scope="col">Tara/Kg</th>
                <th scope="col">Capacidade/Kg</th>
                <th scope="col">Capacidade/M3</th>
                <th scope="col">Capacidade/L</th>
                <th scope="col">UF</th>
                <th scope="col">Tipo Rodado</th>
                <th scope="col">Tipo Carroceria</th>
                <th scope="col">Veiculo próprio</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>{this.renderVeiculos()}</tbody>
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
                ? "Adicionar veiculo"
                : "Editar veiculo"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="placa"
                  name="placa"
                  label="Placa *"
                  style={{ textTransform: "uppercase" }}
                  value={editVeiculo.placa || ""}
                  onChange={this.handleInputChange}
                  pattern="[A-Z0-9]+"
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="rntrc"
                  name="rntrc"
                  label="RNTRC *"
                  type="number"
                  value={editVeiculo.rntrc || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="tara_kg"
                  name="tara_kg"
                  label="Tara/Kg"
                  type="number"
                  value={editVeiculo.tara_kg || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="capacidade_kg"
                  name="capacidade_kg"
                  label="Capacidade/Kg"
                  type="number"
                  value={editVeiculo.capacidade_kg || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="capacidade_m3"
                  name="capacidade_m3"
                  type="number"
                  label="Capacidade/M3"
                  value={editVeiculo.capacidade_m3 || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="capacidade_litros"
                  name="capacidade_litros"
                  label="Capacidade/L"
                  type="number"
                  value={editVeiculo.capacidade_litros || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
            </MDBRow>
            <br />
            <MDBRow>
              <MDBCol sm="5">
              <label><small class="form-text text-muted">UF</small></label>
                <select
                  className="form-control"
                  name="uf_veiculo_licenciado"
                  value={editVeiculo.uf ? editVeiculo.uf.uf : ""}
                  onChange={this.handleInputChange}
                >
                  <option>Selecione uma região</option>
                  {ufs.map((option, index) => (
                    <option key={index} value={option.uf}>
                      {option.uf}
                    </option>
                  ))}
                </select>
              </MDBCol>
              <MDBCol sm="5">
                <label><small class="form-text text-muted">Tipo de rodado</small></label>
                <select
                  className="form-control"
                  name="tipo_rodado"
                  value={
                    editVeiculo.tipoRodado
                      ? editVeiculo.tipoRodado.tipo_rodado
                      : ""
                  }
                  onChange={this.handleInputChange}
                >
                  <option>Selecione um tipo de rodado</option>
                  {tiposRodados.map((option, index) => (
                    <option key={index} value={option.tipo_rodado}>
                      {option.tipo_rodado}
                    </option>
                  ))}
                </select>
              </MDBCol>
              <MDBCol sm="5">
                <label><small class="form-text text-muted">Tipo de carroceria</small></label>
                <select
                  className="form-control"
                  name="tipo_carroceria"
                  value={
                    editVeiculo.tipoCarroceria
                      ? editVeiculo.tipoCarroceria.tipo_carroceria
                      : ""
                  }
                  onChange={this.handleInputChange}
                >
                  <option>Selecione um tipo de carroceria</option>
                  {tiposCarroceria.map((option, index) => (
                    <option key={index} value={option.tipo_carroceria}>
                      {option.tipo_carroceria}
                    </option>
                  ))}
                </select>
              </MDBCol>
              <br />
            </MDBRow>
            <br />
            <MDBCol sm="5">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value={editVeiculo.veiculo_proprio}
                  checked={editVeiculo.veiculo_proprio}
                  id="veiculo_proprio"
                  name="veiculo_proprio"
                  onChange={this.handleInputChange}
                />
                <label class="form-check-label" for="flexCheckDefault">
                  Veículo próprio
                </label>
              </div>
              <br />
              <small class="form-text text-muted">* Campos obrigatórios</small>
            </MDBCol>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              id="termosButton"
              data-toggle="modal"
              onClick={this.editOrAddVeiculo}
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

export default VeiculoComponent;
