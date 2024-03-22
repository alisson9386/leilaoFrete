import React, { Component } from "react";
import AppServices from "../../service/app-service";
import { Button, Form, Pagination } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import {
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsArrowCounterclockwise,
  BsTruck,
} from "react-icons/bs";
import { MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";

class FreteirosEditComponent extends Component {
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

  deleteStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Excluído!", "Proprietário excluído.", "success");
    } else {
      Swal.fire("Erro ao excluir!", `${message}`, "error");
    }
  };

  addStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Salvo!", "Proprietário salvo.", "success");
    } else {
      Swal.fire("Erro ao salvar!", `${message}`, "error");
    }
  };

  updateProprietarioSuccess = (confirm, ...message) => {
    if (confirm) {
        this.componentDidMount();
        Swal.fire("Atualizado!", "Proprietário atualizado.", "success");
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
      this.setState({
        proprietarios: prop,
        filteredProprietarios: prop,
      });
    }
  }

  handleSearchChange = (event) => {
    const search = event.target.value;
    this.setState({ search });
    this.filterProprietarios(search);
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

  handleInputChange = (event) => {
    const { name, value } = event.target;
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
      !editProprietario.ie ||
      !editProprietario.tipoProprietario ||
      !editProprietario.uf ||
      !editProprietario.tel_whatsapp
    ) {
      Swal.fire({
        title: "Ops!",
        text: "É necessário preencher todos os campos!",
        icon: "error",
      });
      return;
    }

    editProprietario.tel_whatsapp = this.formatPhoneNumberForSave(editProprietario.tel_whatsapp);

    AppServices.saveProprietarios(editProprietario)
      .then((res) => {
        if (res.status === 201) {
          Swal.close();
          if(modalMode === 'add'){
              this.addStatus(true);
              this.handleClose();
          }else{
            this.updateProprietarioSuccess(true);
            this.handleClose();
          }
        } else {
          Swal.close();
          this.updateProprietarioSuccess(false, res.statusText);
        }
      })
      .catch((error) => {
        Swal.close();
        this.deleteStatus(false);
        console.log(error);
      });
    console.log(this.state.editProprietario);
  };

  serviceDeleteProprietario = (idProprietario) => {
    this.showLoading("Excluindo");
    AppServices.deleteProprietarios(idProprietario)
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

  formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString).replace(/^55/, "").replace("@c.us","");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  formatPhoneNumberForSave = (phoneNumber) => {
    let cleaned = phoneNumber.replace(/[()\s-]/g, '').replace(/^55/, '').replace("@c.us","");
    const match = cleaned.match(/^(\d{2})(\d{9})$/);
   
    if (match[2].length === 8) {
       cleaned = cleaned.substring(1);
    }
   
    return '55' + cleaned + '@c.us';
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
      <tr key={proprietario.id}>
        <td>{proprietario.id}</td>
        <td>{proprietario.nome}</td>
        <td>{proprietario.cpf_cnpj}</td>
        <td>{proprietario.ie}</td>
        <td>{proprietario.regiao.uf}</td>
        <td>{proprietario.tipoProprietario.tipo_proprietario}</td>
        <td>{this.formatPhoneNumber(proprietario.tel_whatsapp)}</td>
        <td>
          <Button
            variant="info"
            size="sm"
            title="Editar usuário"
            onClick={() => this.handleEditProprietario(proprietario)}
          >
            <BsTruck />
          </Button>{" "}
        </td>
        <td>
          <Button
            variant="warning"
            size="sm"
            title="Editar usuário"
            onClick={() => this.handleEditProprietario(proprietario)}
          >
            <BsFillPencilFill />
          </Button>{" "}
          {proprietario.fl_ativo ? (
            <Button
              variant="danger"
              size="sm"
              title="Desativar"
              onClick={() => this.handleDeleteProprietario(proprietario)}
            >
              <BsFillTrash3Fill />
            </Button>
          ) : (
            <Button variant="secondary" size="sm" title="Ativar">
              <BsArrowCounterclockwise />
            </Button>
          )}
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
          Novo usuário
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
                <th scope="col">Nome</th>
                <th scope="col">CPF/CNPJ</th>
                <th scope="col">IE</th>
                <th scope="col">UF</th>
                <th scope="col">Tipo de proprietário</th>
                <th scope="col">Telefone</th>
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
            <MDBRow tag="form" className="gy-2 gx-3 align-items-center">
              <MDBCol sm="5">
                <MDBInput
                  id="nomw"
                  name="nome"
                  label="Nome"
                  value={editProprietario.nome || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBCol sm="5">
                <MDBInput
                  id="cpf_cnpj"
                  name="cpf_cnpj"
                  type="number"
                  min="11"
                  max="14"
                  label="CPF/CNPJ"
                  value={editProprietario.cpf_cnpj || ""}
                  onChange={this.handleInputChange}
                />
              </MDBCol>
              <MDBRow className="g-2">
                <MDBCol sm="5">
                  <MDBInput
                    id="ie"
                    type="number"
                    name="ie"
                    label="IE"
                    value={editProprietario.ie || ""}
                    onChange={this.handleInputChange}
                  />
                </MDBCol>
                <MDBCol sm="5">
                  <select
                    className="form-control"
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
                  </select>
                </MDBCol>
                <MDBCol sm="5">
                  <select
                    className="form-control"
                    name="uf"
                    value={
                      editProprietario.regiao ? editProprietario.regiao.uf : ""
                    }
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
                  <MDBInput
                    id="tel_whatsapp"
                    type="text"
                    name="tel_whatsapp"
                    label="Telefone"
                    value={this.formatPhoneNumber(
                      editProprietario.tel_whatsapp || ""
                    )}
                    onChange={this.handleInputChange}
                  />
                </MDBCol>
              </MDBRow>
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              id="termosButton"
              data-toggle="modal"
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
      </>
    );
  }
}

export default FreteirosEditComponent;
