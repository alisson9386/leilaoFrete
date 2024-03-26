import React, { Component } from "react";
import Swal from "sweetalert2";

class SwalComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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

  deleteStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Excluído!", "Veículo excluído.", "success");
    } else {
      Swal.fire("Erro ao excluir!", `${message}`, "error");
    }
  };

  addStatus = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Salvo!", "Veículo salvo.", "success");
    } else {
      Swal.fire("Erro ao salvar!", `${message}`, "error");
    }
  };

  updateVeiculoSuccess = (confirm, ...message) => {
    if (confirm) {
      this.componentDidMount();
      Swal.fire("Atualizado!", "Veículo atualizado.", "success");
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

  componentDidMount() {}

  render() {
    return (
      <div className="containerUsually">
        <h3>Modelo</h3>
      </div>
    );
  }
}

export default SwalComponent;
