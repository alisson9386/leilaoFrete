import React, { Component } from "react";
import AppServices from "../../../service/app-service";
import { Button, Form, Pagination } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";
import { MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";
import useAlerts from "../../../context/useAlerts";

class LocaisColetaComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locaisColeta: [],
      ufs: [],
      showModal: false,
      search: "",
      filteredLocaisColeta: [],
      currentPage: 1,
      locaisColetaPerPage: 10,
      editLocaisColeta: {},
      modalMode: "add",
    };
  }

  confirmDeleteLocaisColeta = (locaisColeta) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a excluir o locail de coleta ${locaisColeta.nome}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteLocaisColeta(locaisColeta.id);
      }
    });
  };

  async componentDidMount() {
    const responseLocaisColeta = await AppServices.listLocaisColeta();
    const responseUfs = await AppServices.listUf();
    if (responseLocaisColeta.data) {
      let locais = responseLocaisColeta.data;
      // eslint-disable-next-line
      locais.map((local) => {
        const uf = responseUfs.data.find((tipos) => tipos.id === local.uf);
        local.regiao = uf;
      });

      this.setState({
        locaisColeta: locais,
        filteredLocaisColeta: locais,
      });
    }
    if (responseUfs.data) this.setState({ ufs: responseUfs.data });
  }

  filterLocaisColeta = (search) => {
    const filteredLocaisColeta = this.state.locaisColeta.filter(
      (locaisColeta) =>
        locaisColeta.tipo.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredLocaisColeta, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterLocaisColeta(search);
  };

  handleDeleteLocaisColeta = (locaisColeta) => {
    this.confirmDeleteLocaisColeta(locaisColeta);
  };

  handleEditTipoLocaisColeta = (locaisColeta) => {
    this.handleShow(locaisColeta, "edit");
  };

  handleShow = (locaisColetaData = {}, mode) => {
    this.setState({
      showModal: true,
      editLocaisColeta: locaisColetaData,
      modalMode: mode,
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
      editLocaisColeta: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, type } = event.target;
    let value = type === "checkbox" ? event.target.checked : event.target.value;

    const findItem = (list, key) => list.find((item) => item[key] === value);

    const updateState = (field, item) => {
      this.setState((prevState) => ({
        editLocaisColeta: {
          ...prevState.editLocaisColeta,
          [field]: item ? item : null,
          [name]: item ? item.id : null,
        },
      }));
    };

    if (name === "uf") {
      const tipoUfSelecionado = findItem(this.state.ufs, "uf");
      updateState("uf", tipoUfSelecionado.id);
      updateState("regiao", tipoUfSelecionado);
    } else {
      this.setState((prevState) => ({
        editLocaisColeta: {
          ...prevState.editLocaisColeta,
          [name]: value,
        },
      }));
    }
  };

  editOrAddLocaisColeta = () => {
    const { editLocaisColeta, modalMode } = this.state;
    if (
      !editLocaisColeta.nome ||
      !editLocaisColeta.endereco ||
      !editLocaisColeta.numero ||
      !editLocaisColeta.bairro ||
      !editLocaisColeta.cep ||
      !editLocaisColeta.cidade ||
      !editLocaisColeta.uf
    ) {
      useAlerts.alertCamposObrigatorios();
      return;
    }

    AppServices.saveLocaisColeta(editLocaisColeta)
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

  serviceDeleteLocaisColeta = (idLocaisColeta) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteLocaisColeta(idLocaisColeta)
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

  renderLocaisColetas = () => {
    const { currentPage, locaisColetaPerPage } = this.state;

    const indexOfLastLocaisColeta = currentPage * locaisColetaPerPage;
    const indexOfFirstLocaisColeta =
      indexOfLastLocaisColeta - locaisColetaPerPage;
    const currentLocaisColeta = this.state.filteredLocaisColeta.slice(
      indexOfFirstLocaisColeta,
      indexOfLastLocaisColeta
    );

    return currentLocaisColeta.map((locaisColeta) => (
      <tr key={locaisColeta.id}>
        <td>{locaisColeta.id}</td>
        <td>{locaisColeta.nome}</td>
        <td>{locaisColeta.endereco}</td>
        <td>{locaisColeta.numero}</td>
        <td>{locaisColeta.complemento}</td>
        <td>{locaisColeta.bairro}</td>
        <td>{locaisColeta.cep}</td>
        <td>{locaisColeta.cidade}</td>
        <td>{locaisColeta.regiao.uf}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar locais de coleta"
            onClick={() => this.handleEditTipoLocaisColeta(locaisColeta)}
          >
            <BsFillPencilFill />
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            title="Desativar"
            onClick={() => this.handleDeleteLocaisColeta(locaisColeta)}
          >
            <BsFillTrash3Fill />
          </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, locaisColetaPerPage } = this.state;
    const totalLocaisColetas = this.state.filteredLocaisColeta.length;
    const totalPages = Math.ceil(totalLocaisColetas / locaisColetaPerPage);
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
    const { editLocaisColeta, ufs } = this.state;
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
          Novo tipo locais de coleta
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
                <th scope="col">Razão social</th>
                <th scope="col">Endereço</th>
                <th scope="col">Número</th>
                <th scope="col">Complemento</th>
                <th scope="col">Bairro</th>
                <th scope="col">CEP</th>
                <th scope="col">Cidade</th>
                <th scope="col">UF</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>{this.renderLocaisColetas()}</tbody>
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
                ? "Adicionar local de coleta"
                : "Editar local de coleta"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="nome"
                  name="nome"
                  label="Razão social"
                  value={editLocaisColeta.nome || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="endereco"
                  name="endereco"
                  label="Endereço"
                  value={editLocaisColeta.endereco || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="numero"
                  name="numero"
                  label="Número"
                  type="number"
                  value={editLocaisColeta.numero || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="complemento"
                  name="complemento"
                  label="Complemento"
                  value={editLocaisColeta.complemento || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="bairro"
                  name="bairro"
                  label="Bairro"
                  value={editLocaisColeta.bairro || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="cep"
                  name="cep"
                  label="CEP"
                  type="number"
                  value={editLocaisColeta.cep || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="cidade"
                  name="cidade"
                  label="Cidade"
                  value={editLocaisColeta.cidade || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              </MDBRow>
              <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
              <label><small class="form-text text-muted">UF</small></label>
                <select
                  className="form-control"
                  name="uf"
                  value={editLocaisColeta.regiao ? editLocaisColeta.regiao.uf : ""}
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
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              id="termosButton"
              data-toggle="modal"
              onClick={this.editOrAddLocaisColeta}
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

export default LocaisColetaComponent;
