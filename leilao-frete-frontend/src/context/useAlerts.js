import Swal from "sweetalert2";

class UserAlerts {
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

  deleteStatus = (confirm, ...message) => {
    if (confirm) {
      Swal.fire("Excluído!", `Item excluído.`, "success");
    } else {
      Swal.fire("Erro ao excluir!", `${message}`, "error");
    }
  };

  alteracaoStatus = (confirm, ...message) => {
    if (confirm) {
      Swal.fire("Status alterado!", ``, "success");
    } else {
      Swal.fire("Erro ao alterar status!", `${message}`, "error");
    }
  };

  addStatus = (confirm, ...message) => {
    if (confirm) {
      Swal.fire("Salvo!", `Item salvo.`, "success");
    } else {
      Swal.fire("Erro ao salvar!", `${message}`, "error");
    }
  };

  updateSuccess = (confirm, ...message) => {
    if (confirm) {
      Swal.fire("Atualizado!", `Item atualizado.`, "success");
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

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserAlerts();
