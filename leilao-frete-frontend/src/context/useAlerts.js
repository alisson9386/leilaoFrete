import Swal from "sweetalert2";
import history from "../history";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

class UserAlerts {
  showAlertUserEmpty = () => {
    Swal.fire({
      icon: "warning",
      title: "Usuário e senha devem ser preenchidos",
    });
  };

  showAlertErrorLogin = (err) => {
    Swal.fire({
      icon: "error",
      title: "Falha no login",
      html: err.response.data.error,
    });
  };

  showAlertUserAuthenticated = () => {
    Toast.fire({
      icon: "success",
      title: "Acesso permitido",
    });
  };

  showAlertExclusaoCancelada = () => {
    Toast.fire({
      icon: "error",
      title: "Exclusão cancelada",
    });
  };

  showAlertUserAuthenticatedExpired = () => {
    Toast.fire({
      icon: "info",
      title: "Acesso expirado, necessário refazer o login",
    });
  };

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

  closeSwal = () => {
    Swal.close();
  }

  updateUserSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Usuário atualizado!",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 3000,
    });
    return;
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

  alertTodosCamposObrigatorios = () => {
    Swal.fire({
      title: "Atenção!",
      text: "É necessário preencher todos os campos!",
      icon: "error",
    });
  };

  showAlertErrorReplace = (err) => {
    Swal.fire({
      icon: "error",
      title: "Erro no envio de email de recuperação",
      html: err.response.data.message,
    });
  };

  showAlertEmailSend = () => {
    Swal.fire({
      icon: "success",
      title: "Nova senha enviada ao email de cadastro do usuário!",
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        history.push("/");
      }
    });
  };

  senderMsgSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Mensagens enviadas!",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 3000,
    });
    return;
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserAlerts();
