import React, { Component } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
} from "react-bootstrap";
import {
  BsFillGrid3X3GapFill,
  BsFillPencilFill,
  BsFillPlusCircleFill,
  BsFillTrash3Fill,
  BsListOl,
  BsTruck,
  BsWhatsapp,
} from "react-icons/bs";
import { IMaskInput } from "react-imask";
import Swal from "sweetalert2";
import useAlerts from "../context/useAlerts";
import AppServices from "../service/app-service";
import { buscarEnderecoPorCep } from "../util/viacep";
import SendMsgComponent from "./SendMsgComponent";
import LancesFreteComponent from "./LancesFretes";

class FretesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalMode: "add",
      minDate: "",
      currentPage: 1,
      fretesPerPage: 4,
      filteredFretes: [],
      fretes: [],
      ufs: [],
      unidadesMedida: [],
      locaisColeta: [],
      editFrete: {
        produtos: [],
      },
      showModalTipoVeiculos: false,
      showModalProdutos: false,
      showModalWp: false,
      showModalLances: false,
      tiposRodados: [],
      tiposCarroceria: [],
      tiposRodadosSelecionados: [],
      isDisabled1: true,
      isDisabled2: true,
      produtosAdicionados: [],
      idLeilaoFrete: ''
    };
  }

  confirmDeleteFrete = (frete) => {
    Swal.fire({
      text: `Você está prestes a deletar o frete ${frete.num_leilao}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteFrete(frete.id);
      }
    });
  };

  async componentDidMount() {
    const ufs = await AppServices.listUf();
    const locaisColeta = await AppServices.listLocaisColeta();
    const tiposRodados = await AppServices.listTipoRodado();
    const tiposCarroceria = await AppServices.listTipoCarroceria();
    const unidadesMedida = await AppServices.listUnidadeMedidas();
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
      unidadesMedida: unidadesMedida.data,
    });
    const fretes = await AppServices.listFretes();
    if (fretes.data) {
      const updatedFretes = fretes.data.map((f) => {
        const tiposVeiculos = f.veiculos.map((veiculo) => {
          const tipoRodado = tiposRodados.data.find(
            (tipo) => tipo.id === veiculo.id_tipo_veiculo
          );
          const carroceria = tiposCarroceria.data.find(
            (tipo) => tipo.id === veiculo.id_tipo_carroceria
          );
          return {
            ...tipoRodado,
            quantidade: veiculo.quantidade,
            carroceria,
          };
        });
        const produtosAtualizados = f.produtos.map((produto) => {
          const unidadeMedida = unidadesMedida.data.find(
            (un) => un.id === produto.uni_medida
          );
          return {
            ...produto,
            medida: unidadeMedida,
          };
        });
        const uf = ufs.data.find((ufs) => ufs.id === f.uf);
        const local = locaisColeta.data.find(
          (local) => local.id === f.local_origem
        );
        return {
          ...f,
          tiposVeiculos,
          dt_validade_leilao: this.formatarData(f.dt_validade_leilao, true),
          dt_max_entrega: this.formatarData(f.dt_validade_leilao, true),
          dt_coleta_ordem: this.formatarData(f.dt_validade_leilao, true),
          regiao: uf,
          localDeOrigem: local,
          produtos: produtosAtualizados,
        };
      });
      this.setState({
        fretes: updatedFretes,
        filteredFretes: [...updatedFretes],
      });
    }
  }

  formatarComVirgula(numero) {
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  handleShowModalTiposVeiculos = (editFrete) => {
    var tiposRodadosDisponiveis;
    if (editFrete.tiposVeiculos) {
      tiposRodadosDisponiveis = this.state.tiposRodados.filter((tipo) => {
        var jaSelecionado = editFrete.tiposVeiculos.some(
          (veiculo) => veiculo.id === tipo.id
        );
        return !jaSelecionado;
      });
    } else {
      tiposRodadosDisponiveis = this.state.tiposRodados;
    }

    this.setState({
      tiposRodadosSelecionados: editFrete.tiposVeiculos
        ? editFrete.tiposVeiculos
        : "",
      tiposRodados: tiposRodadosDisponiveis,
      showModalTipoVeiculos: true,
    });
  };

  handleCloseModalTiposVeiculos = () => {
    const { editFrete } = this.state;
    if (editFrete.tiposVeiculos) {
      var filteredTiposVeiculos = editFrete.tiposVeiculos.filter((tipo) => {
        return (
          tipo.tipo_rodado !== "" && tipo.carroceria && tipo.quantidade
        );
      });
    }
    this.setState((prevState) => ({
      ...prevState,
      editFrete: {
        ...prevState.editFrete,
        tiposVeiculos: filteredTiposVeiculos,
      },
      showModalTipoVeiculos: false,
    }));
  };

  handleShowModalProdutos = () => {
    this.setState({
      showModalProdutos: true,
    });
  };

  handleShowModalWp = (idFrete) => {
    this.setState({
      idLeilaoFrete: idFrete,
      showModalWp: true,
    });
  };

  handleShowModalLances = (idFrete) => {
    this.setState({
      idLeilaoFrete: idFrete,
      showModalLances: true,
    });
  };

  handleCloseModalWp = () => {
    this.setState({
      idLeilaoFrete: '',
      showModalWp: false,
    });
    this.componentDidMount();
  };

  handleCloseModalLances = () => {
    this.setState({
      idLeilaoFrete: '',
      showModalLances: false,
    });
    this.componentDidMount();
  };


  handleCloseModalProdutos = () => {
    const { editFrete } = this.state;
    if (editFrete.produtos) {
      var filteredProdutos = editFrete.produtos.filter((produto) => {
        return (
          produto.produto !== "" && produto.uni_medida && produto.quantidade
        );
      });
    }
    this.setState((prevState) => ({
      ...prevState,
      editFrete: {
        ...prevState.editFrete,
        produtos: filteredProdutos,
      },
      showModalProdutos: false,
    }));
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

  handleDeleteFrete = (frete) => {
    this.confirmDeleteFrete(frete);
  };

  handleClose = () => {
    this.componentDidMount();
    this.setState({
      showModal: false,
      tiposRodadosSelecionados: [],
      produtosAdicionados: [],
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

  handleAddNovoProduto = () => {
    this.setState((prevState) => {
      const produtos = Array.isArray(prevState.editFrete.produtos)
        ? [...prevState.editFrete.produtos, {}]
        : [{}];

      return {
        editFrete: {
          ...prevState.editFrete,
          produtos: produtos,
        },
      };
    });
  };

  handleRemoveProdutos = (optionToRemove) => {
    this.setState((prevState) => ({
      editFrete: {
        ...prevState.editFrete,
        produtos: prevState.editFrete.produtos.filter(
          (option) => option !== optionToRemove
        ),
      },
    }));
  };

  handleInputQuantidade = (event, option) => {
    const updatedTiposRodadosSelecionados =
      this.state.tiposRodadosSelecionados.map((tipo) => {
        if (tipo.id === option.id) {
          return { ...tipo, quantidade: event.target.value };
        }
        return tipo;
      });
    this.setState((prevState) => ({
      tiposRodadosSelecionados: updatedTiposRodadosSelecionados,
      editFrete: {
        ...prevState.editFrete,
        tiposVeiculos: updatedTiposRodadosSelecionados,
      },
    }));
  };

  handleInputCarroceria = (event, rodado) => {
    const updatedTiposRodadosSelecionados =
      this.state.tiposRodadosSelecionados.map((tipo) => {
        if (tipo.id === rodado.id) {
          const tipoCarroceria = this.state.tiposCarroceria.find(
            (tipos) => tipos.tipo_carroceria === event.target.value
          );
          return { ...tipo, carroceria: tipoCarroceria };
        }
        return tipo;
      });
    this.setState((prevState) => ({
      tiposRodadosSelecionados: updatedTiposRodadosSelecionados,
      editFrete: {
        ...prevState.editFrete,
        tiposVeiculos: updatedTiposRodadosSelecionados,
      },
    }));
  };

  buscarEndereco = async (event) => {
    if (event.target.value !== "") {
      const enderecoEncontrado = await buscarEnderecoPorCep(event.target.value);
      if (enderecoEncontrado != null && !enderecoEncontrado.erro) {
        const editFreteAtualizado = { ...this.state.editFrete };
        const ufs = this.state.ufs;
        const uf = ufs.find((r) => r.uf === enderecoEncontrado.uf);
  
        editFreteAtualizado.uf = uf.id;
        editFreteAtualizado.regiao = uf;
        editFreteAtualizado.cidade_destino = enderecoEncontrado.localidade;
        if(enderecoEncontrado.logradouro && enderecoEncontrado.bairro){
          editFreteAtualizado.endereco_destino = enderecoEncontrado.logradouro;
          editFreteAtualizado.bairro_destino = enderecoEncontrado.bairro;
          this.setState({ isDisabled1: true, isDisabled2: true });
        }else{
          editFreteAtualizado.endereco_destino = '';
          editFreteAtualizado.bairro_destino = '';
          this.setState({ isDisabled2: false });
        }
  
        this.setState({ editFrete: editFreteAtualizado });
      } else {
        const editFreteAtualizado = { ...this.state.editFrete };
        delete editFreteAtualizado.endereco_destino;
        delete editFreteAtualizado.cidade_destino;
        delete editFreteAtualizado.uf;
        delete editFreteAtualizado.regiao;
        delete editFreteAtualizado.numero_destino;
        this.setState({ isDisabled1: false, isDisabled2: false, editFrete: editFreteAtualizado });
      }
    }
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

    const produtoMatch = name.match(/produtos\.(\d+)?\.?(.+)/);
    if (produtoMatch) {
      const [, index, field] = produtoMatch;
      if (index === undefined) {
        this.setState((prevState) => ({
          editFrete: {
            ...prevState.editFrete,
            produtos: [...prevState.editFrete.produtos, { [field]: value }],
          },
        }));
      } else {
        this.setState((prevState) => {
          var unidade = [];
          const produtosAtualizados = prevState.editFrete.produtos.map(
            (produto, i) => {
              if (i === parseInt(index)) {
                if (field === "uni_medida") {
                  unidade = this.state.unidadesMedida.find(
                    (u) => u.uni_medida === value
                  );

                  return { ...produto, [field]: unidade.id, medida: unidade };
                }
                return { ...produto, [field]: value };
              }
              return produto;
            }
          );
          return {
            editFrete: {
              ...prevState.editFrete,
              produtos: produtosAtualizados,
            },
          };
        });
      }
    } else if (name === "uf") {
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
              this.componentDidMount();
            } else {
              useAlerts.updateSuccess(true);
              this.handleClose();
              this.componentDidMount();
            }
          } else {
            useAlerts.showAlertError(res.statusText);
            this.componentDidMount();
          }
        })
        .catch((error) => {
          useAlerts.addStatus(false, "Veículo", error);
          this.componentDidMount();
        });
    } else {
      AppServices.updateFrete(editFrete, editFrete.id)
        .then((res) => {
          if (res.status === 200) {
            useAlerts.updateSuccess(true);
            this.handleClose();
            this.componentDidMount();
          } else {
            useAlerts.showAlertError(res.statusText);
            this.componentDidMount();
          }
        })
        .catch((error) => {
          useAlerts.addStatus(false, "Veículo", error);
          this.componentDidMount();
        });
    }
  };

  serviceDeleteFrete = (idFrete) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteFrete(idFrete)
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
        useAlerts.showAlertError(error);
        this.componentDidMount();
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
    if (typeof editFrete.vl_lance_maximo === "string")
      Number(
        (editFrete.vl_lance_maximo = editFrete.vl_lance_maximo.replace(
          ",",
          "."
        ))
      );
    editFrete.produtos = editFrete.produtos.filter((produto) => {
      return produto.produto !== "" && produto.uni_medida && produto.quantidade;
    });

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
      editFrete.tiposVeiculos.length > 0 &&
      editFrete.produtos.length > 0
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
              <div className="col-6" key={frete.id}>
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
                      <Row>
                        <Container>
                          <p>
                            Número da ordem de venda:{" "}
                            <Badge variant="primary">
                              {frete.nm_ordem_venda}
                            </Badge>
                          </p>
                          <p>
                            Valor do lance máximo:{" "}
                            <Badge variant="primary">
                              R${" "}
                              {this.formatarComVirgula(frete.vl_lance_maximo)}
                            </Badge>
                          </p>
                          <p>
                            Local de Origem:{" "}
                            <Badge variant="primary">
                              {frete.localDeOrigem
                                ? frete.localDeOrigem.nome
                                : "Não definido"}
                            </Badge>
                          </p>
                          <p>
                            Local de Destino:{" "}
                            {`${frete.endereco_destino}, N° ${
                              frete.numero_destino
                            } - ${frete.cidade_destino}, ${
                              frete.regiao ? frete.regiao.uf : "Não definido"
                            } ${frete.cep_destino}`}
                          </p>
                        </Container>
                      </Row>
                      <footer className="custom-footer">
                        {descricao === "Em lance" ? (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                          >
                            <BsListOl
                              color="white"
                              onClick={() => this.handleShowModalLances(frete.id)}
                              size={25}
                              title="Verificar ranking dos lances"
                            ></BsListOl>
                          </button>
                        ) : (
                          ""
                        )}
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                        >
                          <BsWhatsapp
                            color={frete.wp_enviado ? "green" : "gray"}
                            onClick={() => this.handleShowModalWp(frete.id)}
                            size={25}
                            title="Enviar mensagem de whatsapp para todos os proprietários aptos"
                          ></BsWhatsapp>
                        </button>{" "}
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          title="Editar"
                          onClick={() => this.handleEditFrete(frete)}
                        >
                          <BsFillPencilFill />
                        </button>{" "}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          title="Excluir"
                          onClick={() => this.handleDeleteFrete(frete)}
                        >
                          <BsFillTrash3Fill />
                        </button>{" "}
                      </footer>
                    </blockquote>
                  </div>
                </div>
                <br />
              </div>
              <br />
            </>
          );
        })}
      </div>
    );
  };

  render() {
    const {
      editFrete,
      ufs,
      locaisColeta,
      tiposRodados,
      tiposCarroceria,
      isDisabled1,
      isDisabled2,
      unidadesMedida,
    } = this.state;
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

          <div className="card-container" style={{ width: "100%" }}>
            {this.renderFretes()}
          </div>
          <div>{this.renderPagination()}</div>
          <br />
          <br />
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
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">R$</span>
                    </div>
                    <Form.Control
                      id="vl_lance_maximo"
                      name="vl_lance_maximo"
                      type="text"
                      step="0.01"
                      placeholder="Lance máximo"
                      value={this.formatarComVirgula(
                        editFrete.vl_lance_maximo || ""
                      )}
                      onChange={this.handleInputChange}
                    />
                  </div>
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
              <hr className="hr" />
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
                    onClick={() => this.handleShowModalTiposVeiculos(editFrete)}
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
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    name="cep_destino"
                    type="text"
                    placeholder="CEP"
                    value={editFrete.cep_destino || ""}
                    onChange={this.handleInputChange}
                    onBlur={this.buscarEndereco}
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
                    disabled={isDisabled2}
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
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    name="bairro_destino"
                    type="text"
                    placeholder="Bairro"
                    value={editFrete.bairro_destino || ""}
                    onChange={this.handleInputChange}
                    disabled={isDisabled2}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    name="cidade_destino"
                    type="text"
                    placeholder="Cidade"
                    value={editFrete.cidade_destino || ""}
                    onChange={this.handleInputChange}
                    disabled={isDisabled1}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>UF</Form.Label>
                  <Form.Select
                    name="uf"
                    value={editFrete.regiao ? editFrete.regiao.uf : ""}
                    onChange={this.handleInputChange}
                    disabled={isDisabled1}
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
              <Row className="mb-3">
                <Form.Group>
                  <br />
                  <Button
                    variant={
                      editFrete.produtos && editFrete.produtos.length > 0
                        ? "success"
                        : "danger"
                    }
                    size="sm"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={
                      editFrete.produtos <= 0
                        ? "Adicionar produtos"
                        : "Produtos adicionados"
                    }
                    onClick={() => this.handleShowModalProdutos()}
                  >
                    Produtos <BsFillGrid3X3GapFill />
                  </Button>
                </Form.Group>
              </Row>
              <br />
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
              <small className="form-text text-muted">Tipo de Veículo</small>
            </label>
            <select
              className="form-control"
              name="tiposVeiculos"
              value="Selecione um tipo de veiculo"
              onChange={this.handleInputChange}
            >
              <option>Selecione um tipo de veiculo</option>
              {Array.isArray(tiposRodados) &&
                tiposRodados.map((option, index) => (
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
                  {Array.isArray(this.state.tiposRodadosSelecionados) &&
                    this.state.tiposRodadosSelecionados.map((option, index) => (
                      <tr key={index}>
                        <td style={{ verticalAlign: "middle" }}>
                          <h6>
                            <Badge bg="dark">{option.tipo_rodado}</Badge>
                          </h6>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            name="tipoCarroceria.select"
                            value={
                              option.carroceria
                                ? option.carroceria.tipo_carroceria
                                : ""
                            }
                            style={{ textAlign: "center" }}
                            onChange={(e) =>
                              this.handleInputCarroceria(e, option)
                            }
                          >
                            <option>Selecione</option>
                            {tiposCarroceria.map((option, index) => (
                              <option
                                key={index}
                                value={option.tipo_carroceria}
                              >
                                {option.tipo_carroceria}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            //className="custom-input"
                            className="form-control"
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
                            onClick={() =>
                              this.handleRemoveTiposVeiculos(option)
                            }
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

        <Modal
          className="modal modal-lg"
          show={this.state.showModalProdutos}
          onHide={this.handleCloseModalProdutos}
        >
          <Modal.Header closeButton>
            <Modal.Title>Produtos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              variant="primary"
              size="sm"
              name="produtos"
              title="Novo produto"
              onClick={this.handleAddNovoProduto}
            >
              <BsFillPlusCircleFill />
            </Button>
            <br />
            <br />
            <div className="table-responsive">
              <table className="table table-striped table-hover table-sm">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Unidade de medida</th>
                    <th>Quantidade</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(editFrete.produtos) &&
                    editFrete.produtos.map((option, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name={`produtos.${index}.produto`}
                            value={option.produto || ""}
                            placeholder="Produto"
                            onChange={this.handleInputChange}
                          />
                        </td>
                        <td>
                          <select
                            name={`produtos.${index}.uni_medida`}
                            className="form-control"
                            value={
                              option.medida ? option.medida.uni_medida : ""
                            }
                            style={{ textAlign: "center" }}
                            onChange={this.handleInputChange}
                          >
                            <option>Selecione</option>
                            {unidadesMedida.map((option, index) => (
                              <option key={index} value={option.uni_medida}>
                                {option.uni_medida}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            //className="custom-input"
                            name={`produtos.${index}.quantidade`}
                            className="form-control"
                            type="number"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Caso seja salvo em branco, o padrão será 1"
                            min={1}
                            style={{ textAlign: "center" }}
                            value={option.quantidade}
                            onChange={this.handleInputChange}
                          />
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            title="Remover"
                            onClick={() => this.handleRemoveProdutos(option)}
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
            <Button variant="info" onClick={this.handleCloseModalProdutos}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="modal modal-lg"
          show={this.state.showModalWp}
          onHide={this.handleCloseModalWp}
        >
          <Modal.Header closeButton>
            <Modal.Title>Mensagens</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SendMsgComponent
              leilaoId={this.state.idLeilaoFrete} showModalWp={this.state.showModalWp} fecharModal={this.handleCloseModalWp}
            />
          </Modal.Body>
          <Modal.Footer>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="info" onClick={this.handleCloseModalWp}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="modal modal-lg"
          show={this.state.showModalLances}
          onHide={this.handleCloseModalLances}
        >
          <Modal.Header closeButton>
            <Modal.Title>Lances</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LancesFreteComponent
              leilaoId={this.state.idLeilaoFrete} showModalLances={this.state.showModalLances} fecharModal={this.handleCloseModalLances}
            />
          </Modal.Body>
          <Modal.Footer>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="info" onClick={this.handleCloseModalLances}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default FretesComponent;
