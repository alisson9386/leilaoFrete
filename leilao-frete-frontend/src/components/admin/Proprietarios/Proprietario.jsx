import React, { Component } from "react";
import { Button, Col, Form, Pagination, Row } from "react-bootstrap";
import AppServices from "../../../service/app-service";

import Modal from "react-bootstrap/Modal";
import {
  BsArrowCounterclockwise,
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsFillXCircleFill,
  BsTruck,
  BsSortAlphaDownAlt,
  BsSortAlphaDown
} from "react-icons/bs";
import { IMaskInput } from "react-imask";
import Swal from "sweetalert2";
import useAlerts from "../../../context/useAlerts";
import VeiculoComponent from "../Veiculo/Veiculo";

class ProprietariosEditComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proprietarios: [],
      tipoProprietarios: [],
      ufs: [],
      showModal: false,
      search: "",
      filteredProprietarios: [],
      currentPage: 1,
      proprietariosPerPage: 10,
      editProprietario: {},
      modalMode: "add",
      showModalVeiculo: false,
      editVeiculo: {},
      idProprietarioModalVeiculo: "",
      cpfCnpjMask: "000.000.000-00",
      ordenacaoChave: "nome",
      ordenacaoDirecao: "asc",
    };
  }

  confirmDeleteProprietario = (proprietario) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a desativar o proprietário ${proprietario.nome}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceDeleteProprietario(proprietario.id);
      }
    });
  };

  async componentDidMount() {
    const responseTipoProprietarios = await AppServices.listTipoProprietarios();
    const responseUfs = await AppServices.listUf();
    if (responseTipoProprietarios.data)
      this.setState({ tipoProprietarios: responseTipoProprietarios.data });
    if (responseUfs.data) this.setState({ ufs: responseUfs.data });
    const proprietarios = await AppServices.listProprietarios();
    if (proprietarios.data) {
      let prop = proprietarios.data;
      // eslint-disable-next-line
      prop.map((proprietario) => {
        const tipo = responseTipoProprietarios.data.find(
          (tipos) => tipos.id === proprietario.tipo_proprietario
        );
        const uf = responseUfs.data.find(
          (tipos) => tipos.id === proprietario.uf
        );
        proprietario.tipoProprietario = tipo;
        proprietario.regiao = uf;
      });
      const listaOrdenada = prop.sort((a, b) => a.nome.localeCompare(b.nome));
      this.setState({
        proprietarios: listaOrdenada,
        filteredProprietarios: listaOrdenada,
      });
    }
  }

  updateCpfCnpjMask = (value) => {
    // Permite até 11 dígitos para CPFs
    if (value.length > 11 && value.length <= 14) {
      this.setState({ cpfCnpjMask: "000.000.000-00" }); // Muda para CPF
    } else {
      this.setState({ cpfCnpjMask: "00.000.000/0000-00" }); // Muda para CNPJ
    }
  };

  ordenarProprietarios = (chave, direcao) => {
    const filteredProprietarios = [...this.state.filteredProprietarios].sort((a, b) => {
       if (a[chave] < b[chave]) {
         return direcao === 'asc' ? -1 : 1;
       }
       if (a[chave] > b[chave]) {
         return direcao === 'asc' ? 1 : -1;
       }
       return 0;
    });
   
    this.setState({ proprietarios: filteredProprietarios, filteredProprietarios:  filteredProprietarios});
   };

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterProprietarios(search);
  };

  handleClickTitulo = (chave) => {
    const direcao = this.state.ordenacaoDirecao === 'asc' ? 'desc' : 'asc';
    this.setState({ ordenacaoChave: chave, ordenacaoDirecao: direcao }, () => {
       this.ordenarProprietarios(chave, direcao);
    });
   };

  filterProprietarios = (search) => {
    const filteredProprietarios = this.state.proprietarios.filter(
      (proprietarios) =>
        proprietarios.nome.toLowerCase().includes(search.toLowerCase())
    );
    this.setState({ filteredProprietarios, currentPage: 1 });
  };

  toggleShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  togglePasswordFields = () => {
    this.setState({ showPasswordFields: true, buttonPassword: false });
  };

  handleDeleteProprietario = (proprietario) => {
    this.confirmDeleteProprietario(proprietario);
  };

  handleEditProprietario = (proprietario) => {
    this.handleShow(proprietario, "edit");
  };

  handleShow = (proprietarioData = {}, mode) => {
    this.setState({
      showModal: true,
      editProprietario: proprietarioData,
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
      editProprietario: {},
    });
    this.componentDidMount();
  };

  handleShowModalVeiculo = (idProprietario) => {
    this.setState({
      showModalVeiculo: true,
      idProprietarioModalVeiculo: idProprietario,
    });
  };

  handleCloseModalVeiculo = () => {
    this.setState({
      showModalVeiculo: false,
      editVeiculo: {},
    });
    this.componentDidMount();
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "cpf_cnpj") {
      this.updateCpfCnpjMask(value);
    }
    if (name === "tipoProprietario") {
      const tipoProprietariosSelecionado = this.state.tipoProprietarios.find(
        (tipo) => tipo.tipo_proprietario === value
      );
      if (tipoProprietariosSelecionado !== undefined) {
        this.setState((prevState) => ({
          editProprietario: {
            ...prevState.editProprietario,
            tipoProprietario: tipoProprietariosSelecionado
              ? tipoProprietariosSelecionado
              : null,
            tipo_proprietario: tipoProprietariosSelecionado.id
              ? tipoProprietariosSelecionado.id
              : null,
          },
        }));
      } else {
        this.setState((prevState) => ({
          editProprietario: {
            ...prevState.editProprietario,
            tipoProprietario: null,
            tipo_proprietario: null,
          },
        }));
      }
    } else if (name === "uf") {
      const tipoUfSelecionado = this.state.ufs.find(
        (tipo) => tipo.uf === value
      );
      if (tipoUfSelecionado !== undefined) {
        this.setState((prevState) => ({
          editProprietario: {
            ...prevState.editProprietario,
            regiao: tipoUfSelecionado ? tipoUfSelecionado : null,
            uf: tipoUfSelecionado.id ? tipoUfSelecionado.id : null,
          },
        }));
      } else {
        this.setState((prevState) => ({
          editProprietario: {
            ...prevState.editProprietario,
            regiao: null,
            uf: null,
          },
        }));
      }
    } else {
      this.setState((prevState) => ({
        editProprietario: {
          ...prevState.editProprietario,
          [name]: value,
        },
      }));
    }
  };

  editOrAddProprietario = () => {
    const { editProprietario, modalMode } = this.state;
    if (
      !editProprietario.nome ||
      !editProprietario.cpf_cnpj ||
      !editProprietario.tipoProprietario ||
      !editProprietario.uf ||
      !editProprietario.tel_whatsapp
    ) {
      useAlerts.alertCamposObrigatorios();
      return;
    }

    editProprietario.tel_whatsapp = this.formatPhoneNumberForSave(
      editProprietario.tel_whatsapp,
      true
    );

    editProprietario.tel_contato = this.formatPhoneNumberForSave(
      editProprietario.tel_contato,
      false
    );

    AppServices.saveProprietarios(editProprietario)
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
        useAlerts.showAlertError(error);
        this.componentDidMount();
      });
  };

  serviceAlterarProprietario = (idProprietario) => {
    useAlerts.showLoading("Alterando proprietário");
    AppServices.alterarStatusProprietario(idProprietario)
      .then((res) => {
        Swal.close();
        if (res.status === 200) {
          useAlerts.alteracaoStatus(true);
          this.componentDidMount();
        } else {
          useAlerts.alteracaoStatus(false, res.data.message);
          this.componentDidMount();
        }
      })
      .catch((error) => {
        Swal.close();
        useAlerts.showAlertError(error);
        this.componentDidMount();
      });
  };

  serviceDeleteProprietario = (idProprietario) => {
    useAlerts.showLoading("Excluindo");
    AppServices.deleteProprietarios(idProprietario)
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

  getStatusColor(fl_ativo) {
    if (fl_ativo) return "";
    else return "table-danger";
  }

  formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString)
      .replace(/^55/, "")
      .replace("@c.us", "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  formatPhoneNumberForSave = (phoneNumber, whatsapp) => {
    let cleaned = phoneNumber
      .replace(/[()\s-]/g, "")
      .replace(/^55/, "")
      .replace("@c.us", "");
    const match = cleaned.match(/^(\d{2})(\d{9})$/);

    if (match[2].length === 8) {
      cleaned = cleaned.substring(1);
    }

    if (!whatsapp) return cleaned;

    return "55" + cleaned + "@c.us";
  };

  renderProprietarios = () => {
    const { currentPage, proprietariosPerPage } = this.state;

    const indexOfLastProprietario = currentPage * proprietariosPerPage;
    const indexOfFirstProprietario =
      indexOfLastProprietario - proprietariosPerPage;
    const currentProprietarios = this.state.filteredProprietarios.slice(
      indexOfFirstProprietario,
      indexOfLastProprietario
    );

    return currentProprietarios.map((proprietario) => (
      <tr
        key={proprietario.id}
        style={{
          backgroundColor: proprietario.fl_ativo ? "transparent" : "#F7AAA9 ",
        }}
      >
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.id}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.nome}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.cpf_cnpj}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.email}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.ie}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.regiao.uf}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.tipoProprietario.tipo_proprietario}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {this.formatPhoneNumber(proprietario.tel_contato)}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {this.formatPhoneNumber(proprietario.tel_whatsapp)}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          {proprietario.fl_ativo ? "Ativo" : "Suspenso"}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          <Button
            variant="info"
            size="sm"
            title="Veículo"
            onClick={() => this.handleShowModalVeiculo(proprietario.id)}
          >
            <BsTruck />
          </Button>{" "}
        </td>
        <td className={this.getStatusColor(proprietario.fl_ativo)}>
          <Button
            variant="warning"
            size="sm"
            title="Editar"
            onClick={() => this.handleEditProprietario(proprietario)}
          >
            <BsFillPencilFill />
          </Button>{" "}
          {proprietario.fl_ativo ? (
            <Button
              variant="dark"
              size="sm"
              title="Suspender"
              onClick={() => this.serviceAlterarProprietario(proprietario.id)}
            >
              <BsFillXCircleFill />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              title="Ativar"
              onClick={() => this.serviceAlterarProprietario(proprietario.id)}
            >
              <BsArrowCounterclockwise />
            </Button>
          )}{" "}
          <Button
            variant="danger"
            size="sm"
            title="Excluir"
            onClick={() => this.handleDeleteProprietario(proprietario)}
          >
            <BsFillTrash3Fill />
          </Button>
        </td>
      </tr>
    ));
  };

  renderPagination = () => {
    const { currentPage, proprietariosPerPage } = this.state;
    const totalProprietarios = this.state.filteredProprietarios.length;
    const totalPages = Math.ceil(totalProprietarios / proprietariosPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <>
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => this.setState({ currentPage: number })}
          >
            {number}
          </Pagination.Item>
          <br />
        </>
      );
    }
    return (
      <>
        <br />
        <div>
          <Pagination>{items}</Pagination>
        </div>
        <br />
      </>
    );
  };

  render() {
    const { tipoProprietarios, editProprietario, ufs } = this.state;
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
          Novo proprietário
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
                <th scope="col" onClick={() => this.handleClickTitulo('id')}>ID</th>
                <th scope="col" className="titulo-ordenavel" onClick={() => this.handleClickTitulo('nome')}>Nome <BsSortAlphaDown/></th>
                <th scope="col">CPF/CNPJ</th>
                <th scope="col">Email</th>
                <th scope="col">IE</th>
                <th scope="col">UF</th>
                <th scope="col">Tipo de proprietário</th>
                <th scope="col">Telefone</th>
                <th scope="col">Telefone Whatsapp</th>
                <th scope="col">Status</th>
                <th scope="col">Veículos</th>
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
                ? "Adicionar proprietário"
                : "Editar proprietário"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="gy-2 gx-3 align-items-center">
                <Col sm="5">
                  <Form.Control
                    id="nomw"
                    name="nome"
                    placeholder="Nome"
                    value={editProprietario.nome || ""}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col sm="5">
                  <Form.Control
                    id="cpf_cnpj"
                    name="cpf_cnpj"
                    type="text"
                    as={IMaskInput}
                    mask={this.state.cpfCnpjMask}
                    placeholder="CPF/CNPJ"
                    value={editProprietario.cpf_cnpj || ""}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col sm="5">
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={editProprietario.email || ""}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col sm="5">
                  <Form.Control
                    id="ie"
                    name="ie"
                    type="number"
                    placeholder="IE"
                    value={editProprietario.ie || ""}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col sm="5">
                  <Form.Control
                    id="tel_whatsapp"
                    type="text"
                    name="tel_whatsapp"
                    placeholder="Whatsapp"
                    as={IMaskInput}
                    mask="(00) 00000-0000"
                    onChange={this.handleInputChange}
                    value={editProprietario.tel_whatsapp || ""}
                  />
                </Col>
                <Col sm="5">
                  <Form.Control
                    id="tel_contato"
                    type="text"
                    name="tel_contato"
                    placeholder="Contato"
                    as={IMaskInput}
                    mask="(00) 00000-0000"
                    value={editProprietario.tel_contato || ""}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Row className="gy-2 gx-3 align-items-center">
                  <Col sm="5">
                    <Form.Label>
                      <small className="form-text text-muted">
                        Tipo de proprietário
                      </small>
                    </Form.Label>
                    <Form.Select
                      name="tipoProprietario"
                      value={
                        editProprietario.tipoProprietario
                          ? editProprietario.tipoProprietario.tipo_proprietario
                          : ""
                      }
                      onChange={this.handleInputChange}
                    >
                      <option>Selecione uma função</option>
                      {tipoProprietarios.map((option, index) => (
                        <option key={index} value={option.tipo_proprietario}>
                          {option.tipo_proprietario}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col sm="5">
                    <Form.Label>
                      <small className="form-text text-muted">UF</small>
                    </Form.Label>
                    <Form.Select
                      name="uf"
                      value={
                        editProprietario.regiao
                          ? editProprietario.regiao.uf
                          : ""
                      }
                      onChange={this.handleInputChange}
                    >
                      <option>Selecione uma região</option>
                      {ufs.map((option, index) => (
                        <option key={index} value={option.uf}>
                          {option.uf}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              id="termosButton"
              type="submit"
              onClick={this.editOrAddProprietario}
            >
              Salvar
            </Button>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="danger" onClick={this.handleClose}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="modal modal-lg"
          show={this.state.showModalVeiculo}
          onHide={this.handleCloseModalVeiculo}
          dialogClassName="custom-modal-veiculo"
        >
          <Modal.Header closeButton>
            <Modal.Title>Veículos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <VeiculoComponent
              proprietarioId={this.state.idProprietarioModalVeiculo}
            />
          </Modal.Body>
          <Modal.Footer>
            <span style={{ marginLeft: "10px" }}></span>
            <Button variant="info" onClick={this.handleCloseModalVeiculo}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ProprietariosEditComponent;
