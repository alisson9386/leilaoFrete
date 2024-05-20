import React, { useEffect, useState } from "react";
import { Badge, Button, Card, ListGroup, Modal } from "react-bootstrap";
import {
  BsCheck,
  BsFillTrash3Fill,
  BsInfoCircle,
  BsTrophyFill
} from "react-icons/bs";
import Swal from "sweetalert2";
import Podium from "../Podium";
import useAlerts from "../context/useAlerts";
import AppServices from "../service/app-service";

const LancesFreteComponent = ({ leilaoId, showModalLances, fecharModal }) => {
  const [frete, setFrete] = useState([]);
  const [lancesFrete, setLancesFrete] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [lanceSel, setLanceSel] = useState([]);
  const [vencedor, setVencedor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (showModalLances) {
        useAlerts.showLoading("Aguarde!");
        const freteResponse = await AppServices.listFreteById(leilaoId);
        const lancesFrete = await AppServices.listLancesFreteByLeilao(
          freteResponse.data.num_leilao
        );
        const props = await AppServices.listProprietarios();

        const lances = lancesFrete.data.map((lf) => {
          const proprietarioFiltrado = props.data.find(
            (p) => formatarNumeroWp(p.tel_whatsapp) === lf.wp_lance
          );

          return {
            ...lf,
            proprietario: proprietarioFiltrado ? proprietarioFiltrado : null,
          };
        });

        setVencedor(lances.filter((l) => l.oferta_vencedora === 1));

        setFrete(freteResponse.data);
        setLancesFrete(lances);
        useAlerts.closeSwal();
      }
    };

    fetchData();
  }, [leilaoId, showModalLances, fecharModal]);

  const formatarNumeroWp = (numero) => {
    const numerosApenas = numero.replace(/\D/g, "");
    if (numerosApenas.length === 13) {
      return numerosApenas.slice(0, 4) + numerosApenas.slice(5) + "@c.us";
    }
    return numero;
  };

  const formatarComVirgula = (numero) => {
    if (numero) {
      return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const showModal = (lf) => {
    setShowModalInfo(true);
    setLanceSel(lf);
  };

  const closeModal = () => {
    setShowModalInfo(false);
    setLanceSel([]);
  };

  const confirmDeleteLance = (lance) => {
    Swal.fire({
      text: `Deseja deletar o lance do ${lance.proprietario.nome}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        deletarLance(lance.id);
      }
    });
  };

  const confirmVencedorLeilao = (lance) => {
    Swal.fire({
      text: `Deseja selecionar o lance do ${lance.proprietario.nome} como vencedor do leilão?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim!",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        selecionarVencedor(lance);
      }
    });
  };

  const deletarLance = (idLance) => {
    if (idLance) {
      useAlerts.showLoading("Deletando!");
      AppServices.deleteLancesFrete(idLance)
        .then((res) => {
          if (res.status === 200) {
            useAlerts.deleteStatus(true, "Lance excluído!");
            setLancesFrete(lancesFrete.filter((lance) => lance.id !== idLance));
          } else {
            useAlerts.deleteStatus(false, res.statusText);
          }
        })
        .catch((error) => {
          useAlerts.showAlertError(error);
        });
    }
  };

  const selecionarVencedor = async (lance) => {
    if (lance) {
      useAlerts.showLoading("Salvando vencedor!");
      delete lance.proprietario;
      delete lance.position;
      lance.oferta_vencedora = 1;
      try {
        const update = await AppServices.updateLancesFrete(lance.id, lance);
        if (update.status === 200) {
          useAlerts.showAlertSuccess();
          let f = { status: 3 };
          const saveFrete = await AppServices.updateOneFrete(f, frete.id);
          if (saveFrete.status !== 200) {
            useAlerts.showAlertError("Erro ao atualizar frete!");
          }
        } else {
          useAlerts.showAlertError(update.statusText);
        }
      } catch (error) {
        useAlerts.showAlertError(error);
      }
    }
  };

  const sortedLancesFrete = Array.isArray(lancesFrete)
    ? [...lancesFrete].sort((a, b) => a.valor_lance - b.valor_lance)
    : [];

  const podiumWithPositions = sortedLancesFrete.map((winner, index) => ({
    ...winner,
    position: index,
  }));

  return (
    <div>
      {vencedor.length < 1 ? (<Podium winners={Array.isArray(lancesFrete) ? lancesFrete : []} />) : (
        <>
        <div className="containerCenter">
        <BsTrophyFill color="gold" size={50}/>
        <p><Badge bg="success"> Vencedor selecionado</Badge></p>
        </div>
        </>
        
      )}
      {lancesFrete.length > 0 ? (
        <>
          <br />
          <Card style={{ width: "18rem" }}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Leilão: <Badge variant="primary">{frete.num_leilao}</Badge>
              </ListGroup.Item>
              <ListGroup.Item>
                Valor máximo:{" "}
                <Badge variant="primary">
                  R$ {formatarComVirgula(frete.vl_lance_maximo)}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <br />
          <table className="table table-striped table-bordered table-hover table-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Posição</th>
                <th scope="col">Proprietario</th>
                <th scope="col">Valor do lance</th>
                <th scope="col">Lucro</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(podiumWithPositions) ? (
                podiumWithPositions.map((lf) => (
                  <tr key={lf.id}>
                    <td>{lf.position + 1}°</td>
                    <td>{lf.proprietario.nome}</td>
                    <td>R${formatarComVirgula(lf.valor_lance)}</td>
                    <td><Badge bg="success">R${formatarComVirgula(frete.vl_lance_maximo - lf.valor_lance)}</Badge> </td>
                    <td>
                      {vencedor.length === 0 ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            title="Selecionar vencedor"
                            onClick={() => confirmVencedorLeilao(lf)}
                          >
                            <BsCheck />
                          </Button>{" "}
                          <Button
                            variant="warning"
                            size="sm"
                            title="Ver informações do lance"
                            onClick={() => showModal(lf)}
                          >
                            <BsInfoCircle />
                          </Button>{" "}
                          <Button
                            variant="danger"
                            size="sm"
                            title="Eliminar lance"
                            onClick={() => confirmDeleteLance(lf)}
                          >
                            <BsFillTrash3Fill />
                          </Button>{" "}
                        </>
                      ) : lf.id === vencedor[0].id ? (
                        <Badge bg="success">Vencedor do leilão</Badge> 
                      ) : (
                        ""
                      )}
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="containerCenter">
          {" "}
          <h5>Este leilão ainda não possui lances registrados</h5>
        </div>
      )}

      <Modal
        className="modal modal-sm"
        show={showModalInfo}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {lanceSel.id ? (
            <>
              <p>
                <strong>Posição:</strong> {lanceSel.position + 1}°
              </p>
              <p>
                <strong>Proprietário:</strong> {lanceSel.proprietario.nome}
              </p>
              <p>
                <strong>Valor:</strong> R$
                {formatarComVirgula(lanceSel.valor_lance)}
              </p>
            </>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <span style={{ marginLeft: "10px" }}></span>
          <Button variant="info" onClick={closeModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LancesFreteComponent;
