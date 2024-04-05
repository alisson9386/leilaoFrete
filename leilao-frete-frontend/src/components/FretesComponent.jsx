import React, { Component } from "react";
import {
  Badge,
  Button,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
} from "react-bootstrap";
import { BsTruck, BsWhatsapp } from "react-icons/bs";
import { IMaskInput } from "react-imask";
import useAlerts from "../context/useAlerts";
import AppServices from "../service/app-service";

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
      showModalTipoVeiculos: false,
      tiposRodados: [],
      tiposCarroceria: [],
      tiposVeiculos: [],
      tiposRodadosSelecionados: [],
      tipoCarroceriaSelecionado: [],
    };
  }

  async componentDidMount() {
    const ufs = await AppServices.listUf();
    const locaisColeta = await AppServices.listLocaisColeta();
    const tiposRodados = await AppServices.listTipoRodado();
    const tiposCarroceria = await AppServices.listTipoCarroceria();
    tiposRodados.data.sort((a, b) =>
      a.tipo_rodado.localeCompare(b.tipo_rodado)
    );
    tiposCarroceria.data.sort((a, b) =>
      a.tipo_carroceria.localeCompare(b.tipo_carroceria)
    );
    const today = new Date().toISOString().split("T")[0];
    this.setState({
      minDate: today,
      ufs: ufs.data,
      locaisColeta: locaisColeta.data,
      tiposRodados: tiposRodados.data,
      tiposCarroceria: tiposCarroceria.data,
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

  handleShowModalTiposVeiculos = () => {
    this.setState({
      showModalTipoVeiculos: true,
    });
  };

  handleCloseModalTiposVeiculos = () => {
    this.setState({
      showModalTipoVeiculos: false,
    });
  };

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
    this.componentDidMount();
    this.setState({
      showModal: false,
      tiposRodadosSelecionados: [],
      tipoCarroceriaSelecionado: [],
    });
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

  handleSelectTiposVeiculos = (tipo) => {
    this.setState((prevState) => ({
      tiposRodadosSelecionados: [...prevState.tiposRodadosSelecionados, tipo],
      tiposRodados: prevState.tiposRodados.filter((option) => option !== tipo),
    }));
  };

  handleRemoveTiposVeiculos = (optionToRemove) => {
    this.setState((prevState) => ({
      tiposRodadosSelecionados: prevState.tiposRodadosSelecionados.filter(
        (option) => option !== optionToRemove
      ),
      editFrete: {
        ...prevState.editFrete,
        tiposVeiculos: prevState.editFrete.tiposVeiculos.filter(
          (option) => option !== optionToRemove
        ),
      },
      tiposRodados: [...prevState.tiposRodados, optionToRemove].sort((a, b) =>
        a.tipo_rodado.localeCompare(b.tipo_rodado)
      ),
    }));
  };

  handleInputQuantidade = (event, tipo) => {
    let value = event.target.value;
    // eslint-disable-next-line
    this.state.tiposRodadosSelecionados.map((t) => {
      if (t.id === tipo.id) {
        t.quantidade = Number(value);
      }
    });
  };

  handleInputCarroceria = (event, rodado) => {
    const { tiposCarroceria } = this.state;
    let value = event.target.value;
    // eslint-disable-next-line
    this.state.tiposRodadosSelecionados.map((t) => {
      if (t.id === rodado.id) {
        const tipoCarroceria = tiposCarroceria.find(
          (tipos) => tipos.tipo_carroceria === value
        );
        t.carroceria = tipoCarroceria;
      }
    });
  };

  handleInputChange = (event, ...option) => {
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
      updateState("local_origem", localColetaSelecionado?.id);
      updateState("localDeOrigem", localColetaSelecionado);
    } else if (name === "tiposVeiculos") {
      const tipo = findItem(this.state.tiposRodados, "tipo_rodado");
      if (!this.state.editFrete[name]) {
        this.setState((prevState) => ({
          editFrete: {
            ...prevState.editFrete,
            [name]: [],
          },
        }));
      }
      this.setState((prevState) => ({
        editFrete: {
          ...prevState.editFrete,
          [name]: [...prevState.editFrete[name], tipo],
        },
      }));
      this.handleSelectTiposVeiculos(tipo);
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

    if (modalMode === "add") {
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
    } else {
      AppServices.updateFrete(editFrete, editFrete.id)
        .then((res) => {
          if (res.status === 200) {
            useAlerts.updateSuccess(true);
            this.handleClose();
          } else {
            useAlerts.showAlertError(res.statusText);
          }
        })
        .catch((error) => {
          useAlerts.addStatus(false, "Veículo", error);
        });
    }
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

    const dia = data.getUTCDate().toString().padStart(2, "0");
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0"); // Os meses são indexados a partir de 0
    const ano = data.getUTCFullYear();

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
    delete editFrete.regiao;
    delete editFrete.localDeOrigem;
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
      editFrete.ie &&
      editFrete.tiposVeiculos
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
        <br />
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

    return (
      <div className="row">
        {currentFretes.map((frete) => {
          const { descricao, bg } = this.getStatusAndBadgeBg(frete.status); // Ajuste 'frete.status' conforme necessário

          return (
            <>
              <div class="col-sm-6" key={frete.id}>
                <div className="card text-white bg-dark small-card">
                  <div className="card-header">
                    <Badge variant="primary">N° {frete.num_leilao}</Badge> Data
                    de abertura: {this.formatarData(frete.dt_abertura, false)} |
                    Data de validade:{" "}
                    {this.formatarData(frete.dt_validade_leilao, false)}
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
                          ></BsWhatsapp>
                        </button>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
              <br />
            </>
          );
        })}
      </div>
    );
  };

  render() {
    const { editFrete, ufs, locaisColeta, tiposRodados, tiposCarroceria } =
      this.state;
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
            <Modal.Title>
              {this.state.modalMode === "add"
                ? "Novo leilão de frete"
                : "Editar leilão"}
            </Modal.Title>
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
                  <Form.Label>Data coleta ordem de</Form.Label>
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
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Origem da coleta</Form.Label>
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
                  <Form.Label>Data max entrega</Form.Label>
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
              <hr class="hr" />
              <h5>Veículo de transporte</h5>
              <Row className="mb-3">
                <Form.Group>
                  <br />
                  <Button
                    variant={
                      editFrete.tiposVeiculos &&
                      editFrete.tiposVeiculos.length > 0
                        ? "success"
                        : "danger"
                    }
                    size="sm"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={
                      !editFrete.tiposVeiculos
                        ? "Adicionar tipos de veículos"
                        : "Tipos adicionados"
                    }
                    onClick={() => this.handleShowModalTiposVeiculos()}
                  >
                    Tipos de veículos <BsTruck />
                  </Button>
                </Form.Group>
              </Row>

              <br />
              <h5>Destino da coleta</h5>

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
                    type="text"
                    as={IMaskInput}
                    mask="00.000.000/0000-00"
                    placeholder="CNPJ"
                    value={editFrete.cnpj || ""}
                    onChange={this.handleInputChange}
                  />
                </Form.Group>
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
              </Row>
              <Row className="mb-3">
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

        <Modal
          className="modal modal-lg"
          show={this.state.showModalTipoVeiculos}
          onHide={this.handleCloseModalTiposVeiculos}
        >
          <Modal.Header closeButton>
            <Modal.Title>Tipos de Veículos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>
              <small class="form-text text-muted">Tipo de Veículo</small>
            </label>
            <select
              className="form-control"
              name="tiposVeiculos"
              value="Selecione um tipo de veiculo"
              onChange={this.handleInputChange}
            >
              <option>Selecione um tipo de veiculo</option>
              {tiposRodados.map((option, index) => (
                <option key={index} value={option.tipo_rodado}>
                  {option.tipo_rodado}
                </option>
              ))}
            </select>
            <div className="table-responsive">
              <table className="table table-striped table-hover table-sm">
                <thead>
                  <tr>
                    <th>Tipo Rodado</th>
                    <th>Tipo de carroceria</th>
                    <th>Quantidade</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.tiposRodadosSelecionados.map((option, index) => (
                    <tr key={index}>
                      <td>{option.tipo_rodado}</td>
                      <td>
                        <select
                          name="tipoCarroceria.select"
                          value={option.tipo_carroceria}
                          style={{ textAlign: "center" }}
                          onChange={(e) =>
                            this.handleInputCarroceria(e, option)
                          }
                        >
                          <option>Selecione</option>
                          {tiposCarroceria.map((option, index) => (
                            <option key={index} value={option.tipo_carroceria}>
                              {option.tipo_carroceria}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          className="custom-input"
                          name="tiposVeiculos.quantidade"
                          type="number"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Caso seja salvo em branco, o padrão será 1"
                          min={1}
                          style={{ textAlign: "center" }}
                          value={option.quantidade}
                          onChange={(e) =>
                            this.handleInputQuantidade(e, option)
                          }
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          title="Remover"
                          onClick={() => this.handleRemoveTiposVeiculos(option)}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="info" onClick={this.handleCloseModalTiposVeiculos}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default FretesComponent;
