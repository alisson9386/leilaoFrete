import React, { Component } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Pagination,
  Badge,
} from "react-bootstrap";
import { BsWhatsapp } from "react-icons/bs";
import Multiselect from "multiselect-react-dropdown";
import AppServices from "../service/app-service";
import useAlerts from "../context/useAlerts";

class FretesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalMode: "add",
      options: [
        { name: "Option 1️", id: 1 },
        { name: "Option 2️", id: 2 },
      ],
      minDate: "",
      currentPage: 1,
      fretesPerPage: 2,
      filteredFretes: [],
      fretes: [],
      ufs: [],
      locaisColeta: [],
      editFrete: [],
    };
  }

  async componentDidMount() {
    const ufs = await AppServices.listUf();
    const locaisColeta = await AppServices.listLocaisColeta();
    const today = new Date().toISOString().split("T")[0];
    this.setState({
      minDate: today,
      ufs: ufs.data,
      locaisColeta: locaisColeta.data,
    });
    const fretes = await AppServices.listFretes();
    if (fretes.data) {
      let frete = fretes.data;
      // eslint-disable-next-line
      frete.map((f) => {
        const uf = ufs.data.find((ufs) => ufs.id === f.uf);
        const local = locaisColeta.data.find(
          (local) => local.id === f.local_origem
        );
        f.dt_validade_leilao = this.formatarData(f.dt_validade_leilao, true);
        f.dt_max_entrega = this.formatarData(f.dt_validade_leilao, true);
        f.dt_coleta_ordem = this.formatarData(f.dt_validade_leilao, true);
        f.regiao = uf;
        f.localDeOrigem = local;
      });
      console.log(frete);
      this.setState({
        fretes: frete,
        filteredFretes: frete,
      });
    }
  }

  handleShow = (freteData = {}, mode) => {
    this.setState({
      showModal: true,
      editFrete: freteData,
      modalMode: mode,
    });
  };

  handleEditFrete = (frete) => {
    this.handleShow(frete, "edit");
  };

  handleClose = () => {
    this.setState({
      showModal: false,
    });
    this.componentDidMount();
  };

  filterFretes = (search) => {
    const searchString = search.toString();
    const filteredFretes = this.state.fretes.filter((leilao) =>
      leilao.num_leilao.toString().includes(searchString)
    );
    this.setState({ filteredFretes, currentPage: 1 });
  };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterFretes(search);
  };

  handleInputChange = (event) => {
    const { name, type } = event.target;
    let value = type === "checkbox" ? event.target.checked : event.target.value;

    const findItem = (list, key) => list.find((item) => item[key] === value);

    const updateState = (field, item) => {
      this.setState((prevState) => ({
        editFrete: {
          ...prevState.editFrete,
          [field]: item ? item : null,
          [name]: item ? item.id : null,
        },
      }));
    };

    if (name === "uf") {
      const tipoUfSelecionado = findItem(this.state.ufs, "uf");
      updateState("uf", tipoUfSelecionado.id);
      updateState("regiao", tipoUfSelecionado);
    } else if (name === "local_origem") {
      const localColetaSelecionado = findItem(this.state.locaisColeta, "nome");
      updateState("local_origem", localColetaSelecionado.id);
      updateState("localDeOrigem", localColetaSelecionado);
    } else {
      this.setState((prevState) => ({
        editFrete: {
          ...prevState.editFrete,
          [name]: value,
        },
      }));
    }
  };

  editOrAddFrete = () => {
    const { editFrete, modalMode } = this.state;
    let validate = this.validateForm();
    if (!validate) {
      useAlerts.alertTodosCamposObrigatorios();
      return;
    }

    this.complementarLeilao();

    AppServices.saveFrete(editFrete)
      .then((res) => {
        if (res.status === 201) {
          if (modalMode === "add") {
            useAlerts.addStatus(true);
            this.handleClose();
          } else {
            useAlerts.updateSuccess(true);
            this.handleClose();
          }
        } else {
          useAlerts.showAlertError(res.statusText);
        }
      })
      .catch((error) => {
        useAlerts.addStatus(false, "Veículo", error);
      });
  };

  getStatusAndBadgeBg(status) {
    const statusDescricoes = {
      1: "Aberto",
      2: "Em lance",
      3: "Précoleta",
      4: "Encerrado",
    };

    const statusBg = {
      1: "secondary",
      2: "danger",
      3: "warning",
      4: "success",
    };

    const descricao = statusDescricoes[status] || "Status desconhecido";
    const bg = statusBg[status] || "secondary";

    return { descricao, bg };
  }

  formatarData(dataISO, toTela) {
    const data = new Date(dataISO);

    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0"); // Os meses são indexados a partir de 0
    const ano = data.getFullYear();

    if (toTela) return `${ano}-${mes}-${dia}`;
    return `${dia}/${mes}/${ano}`;
  }

  getDataHoje() {
    const data = new Date();
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  complementarLeilao = () => {
    const { editFrete } = this.state;
    editFrete.dt_abertura = this.getDataHoje();
    editFrete.dt_emissao_ordem = this.getDataHoje();
  };

  validateForm() {
    const { editFrete } = this.state;

    if (
      editFrete.dt_validade_leilao &&
      editFrete.vl_lance_maximo &&
      editFrete.dt_coleta_ordem &&
      editFrete.local_origem &&
      editFrete.dt_max_entrega &&
      editFrete.nm_ordem_venda &&
      editFrete.razao_social &&
      editFrete.cnpj &&
      editFrete.endereco_destino &&
      editFrete.numero_destino &&
      editFrete.cep_destino &&
      editFrete.cidade_destino &&
      editFrete.uf &&
      editFrete.ie
    ) {
      return true;
    } else {
      return false;
    }
  }

  renderPagination = () => {
    const { currentPage, fretesPerPage } = this.state;
    const totalFretes = this.state.filteredFretes.length;
    const totalPages = Math.ceil(totalFretes / fretesPerPage);
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

  renderFretes = () => {
    const { currentPage, fretesPerPage } = this.state;

    const indexOfLastFrete = currentPage * fretesPerPage;
    const indexOfFirstFrete = indexOfLastFrete - fretesPerPage;
    const currentFretes = this.state.filteredFretes.slice(
      indexOfFirstFrete,
      indexOfLastFrete
    );

    return currentFretes.map((frete) => {
      const { descricao, bg } = this.getStatusAndBadgeBg(frete.status); // Ajuste 'frete.status' conforme necessário

      return (
        <>
          <div class="row">
            <div class="col-sm-6">
              <div className="card text-white bg-dark small-card">
                <div className="card-header">
                  <Badge variant="primary">N° {frete.num_leilao}</Badge> Data de
                  abertura: {this.formatarData(frete.dt_abertura, false)}
                  <span className="float-end">
                    <Badge bg={bg}>{descricao}</Badge>
                  </span>
                </div>
                <div className="card-body">
                  <blockquote className="blockquote mb-0">
                    <p>
                      Número da ordem de venda:{" "}
                      <Badge variant="primary">{frete.nm_ordem_venda}</Badge>
                    </p>
                    <p>
                      Valor do lance máximo:{" "}
                      <Badge variant="primary">
                        R$ {frete.vl_lance_maximo},00
                      </Badge>
                    </p>
                    <p>
                      Local de Origem:{" "}
                      <Badge variant="primary">
                        {frete.localDeOrigem.nome}
                      </Badge>
                    </p>
                    <p>
                      Local de Destino:{" "}
                      {`${frete.endereco_destino}, N° ${frete.numero_destino} - ${frete.cidade_destino}, ${frete.regiao.uf} ${frete.cep_destino}`}
                    </p>
                    <footer className="custom-footer">
                      <button
                        type="button"
                        class="btn btn-warning btn-sm"
                        onClick={() => this.handleEditFrete(frete)}
                      >
                        Editar frete
                      </button>{" "}
                      <button type="button" class="btn btn-outline-light">
                      <BsWhatsapp
                        color="green"
                        size={30}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Enviar mensagem de whatsapp para todos os proprietários aptos"
                      ></BsWhatsapp></button>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          <br />
        </>
      );
    });
  };

  render() {
    const { editFrete, ufs, locaisColeta } = this.state;
    return (
      <>
        <div className="containerCard">
          <br />
          <br />
          <Button
            variant="primary"
            size="sm"
            data-toggle="tooltip"
            id="termosButton"
            data-placement="right"
            onClick={() => this.handleShow({}, "add")}
          >
            Novo leilão
          </Button>
          <br />
          <br />

          <Form.Control
            type="text"
            placeholder="Pesquisar por número do leilão"
            value={this.state.search}
            onChange={this.handleSearchChange}
          />

          <br />

          <div className="card-container">{this.renderFretes()}</div>
          <div>{this.renderPagination()}</div>
        </div>

        <Modal
          className="modal modal-lg"
          show={this.state.showModal}
          onHide={this.handleClose}
          dialogClassName="custom-modal-leilao"
        >
          <Modal.Header closeButton>
            <Modal.Title>Novo leilão de frete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Data de validade do leilão</Form.Label>
                  <Form.Control
                    id="dt_validade_leilao"
                    name="dt_validade_leilao"
                    type="date"
                    placeholder="Data de validade"
                    min={this.state.minDate}
                    value={editFrete.dt_validade_leilao || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Lance máximo</Form.Label>
                  <Form.Control
                    id="vl_lance_maximo"
                    name="vl_lance_maximo"
                    type="number"
                    placeholder="Lance máximo"
                    value={editFrete.vl_lance_maximo || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Data de coleta da ordem de coleta</Form.Label>
                  <Form.Control
                    id="dt_coleta_ordem"
                    name="dt_coleta_ordem"
                    type="date"
                    placeholder="Data de validade"
                    min={this.state.minDate}
                    value={editFrete.dt_coleta_ordem || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Tipos de veículos</Form.Label>
                  <Multiselect
                    options={this.state.options}
                    selectedValues={this.state.selectedValue}
                    onSelect={this.onSelect}
                    onRemove={this.onRemove}
                    displayValue="name"
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Local de origem da coleta</Form.Label>
                  <Form.Select
                    name="local_origem"
                    value={
                      editFrete.localDeOrigem
                        ? editFrete.localDeOrigem.nome
                        : ""
                    }
                    onChange={this.handleInputChange}
                  >
                    <option>Selecione o local da coleta</option>
                    {locaisColeta.map((option, index) => (
                      <option key={index} value={option.nome}>
                        {option.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Data máxima de entrega destino</Form.Label>
                  <Form.Control
                    name="dt_max_entrega"
                    type="date"
                    placeholder="Data de validade"
                    min={this.state.minDate}
                    value={editFrete.dt_max_entrega || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>

              <br />
              <Form.Label>Local de destino da coleta</Form.Label>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Número da ordem de venda</Form.Label>
                  <Form.Control
                    name="nm_ordem_venda"
                    type="number"
                    placeholder="Número da ordem de venda"
                    value={editFrete.nm_ordem_venda || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Razão social do cliente destino</Form.Label>
                  <Form.Control
                    name="razao_social"
                    type="text"
                    placeholder="Razão social do cliente destino"
                    value={editFrete.razao_social || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>CNPJ</Form.Label>
                  <Form.Control
                    name="cnpj"
                    type="number"
                    placeholder="CNPJ"
                    value={editFrete.cnpj || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    name="endereco_destino"
                    type="text"
                    placeholder="Endereço"
                    value={editFrete.endereco_destino || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    name="numero_destino"
                    type="number"
                    placeholder="Número"
                    value={editFrete.numero_destino || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    name="cep_destino"
                    type="number"
                    placeholder="CEP"
                    value={editFrete.cep_destino || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    name="cidade_destino"
                    type="text"
                    placeholder="Cidade"
                    value={editFrete.cidade_destino || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>UF</Form.Label>
                  <Form.Select
                    name="uf"
                    value={editFrete.regiao ? editFrete.regiao.uf : ""}
                    onChange={this.handleInputChange}
                  >
                    <option>Selecione uma região</option>
                    {ufs.map((option, index) => (
                      <option key={index} value={option.uf}>
                        {option.uf}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Inscrição Estadual</Form.Label>
                  <Form.Control
                    name="ie"
                    type="number"
                    placeholder="IE"
                    value={editFrete.ie || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Produtos</Form.Label>
                  <Multiselect
                    options={this.state.options}
                    selectedValues={this.state.selectedValue}
                    onSelect={this.onSelect}
                    onRemove={this.onRemove}
                    displayValue="name"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Quantidade (s) por produto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Quantidade (s) por produto"
                  />
                </Form.Group>
              </Row>

              <br />
              <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>

              <Button variant="primary" onClick={this.editOrAddFrete}>
                Salvar
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="info" onClick={this.handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default FretesComponent;
