import React, { Component } from "react";
import Swal from "sweetalert2";
import AlertContext from "../../context/AlertContext";

class AlertProvider extends Component {
  showLoading = (text) => {
    Swal.fire({
      title: "Aguarde!",
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  deleteStatus = (confirm, item, ...message) => {
    if (confirm) {
      Swal.fire("Excluído!", `${item} excluído.`, "success");
    } else {
      Swal.fire("Erro ao excluir!", `${message}`, "error");
    }
  };

  addStatus = (confirm, item, ...message) => {
    if (confirm) {
      Swal.fire("Salvo!", `${item} salvo.`, "success");
    } else {
      Swal.fire("Erro ao salvar!", `${message}`, "error");
    }
  };

  updateSuccess = (confirm, item, ...message) => {
    if (confirm) {
      Swal.fire("Atualizado!", `${item} atualizado.`, "success");
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

  alertCamposObrigatorios = () => {
    Swal.fire({
      title: "Atenção!",
      text: "É necessário preencher todos os campos obrigatórios!",
      icon: "error",
    });
  };

  render() {
    return (
      <AlertContext.Provider
        value={{
          showLoading: this.showLoading,
          deleteStatus: this.deleteStatus,
          addStatus: this.addStatus,
          updateSuccess: this.updateSuccess,
          showAlertError: this.showAlertError,
        }}
      >
        {this.props.children}
      </AlertContext.Provider>
    );
  }
}

export default AlertProvider;
