import React, { useEffect, useState } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import Podium from "../Podium";
import useAlerts from "../context/useAlerts";
import AppServices from "../service/app-service";

const LancesFreteComponent = ({ leilaoId, showModalLances, fecharModal }) => {
  const [frete, setFrete] = useState([]);
  const [lancesFrete, setLancesFrete] = useState([]);

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

  const sortedLancesFrete = Array.isArray(lancesFrete)? [...lancesFrete].sort((a, b) => a.valor_lance - b.valor_lance) : [];

  const podiumWithPositions = sortedLancesFrete.map((winner, index) => ({
    ...winner,
     position: index,
   }));


  return (
    <div>
      {lancesFrete.length > 0 ? (
        <>
          <div>
            {" "}
          </div>
          <Podium winners={Array.isArray(lancesFrete) ? lancesFrete : []} />
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
              <th scope="col">Opções</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(podiumWithPositions) ? (
              podiumWithPositions.map((lf) => (
                <tr key={lf.id}>
                  <td>{lf.position + 1}°</td>
                  <td>{lf.proprietario.nome}</td>
                  <td>{lf.valor_lance}</td>
                  <td><Button variant="primary" size="sm">Ganhador</Button></td>{" "}
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
        </>
      ) : (
        <>
          <div className="containerCenter">
            {" "}
            <h5>Este leilão ainda não possui lances registrados</h5>
          </div>
        </>
      )}
    </div>
  );
};

export default LancesFreteComponent;
