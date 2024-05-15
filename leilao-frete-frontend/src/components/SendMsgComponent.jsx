import React, { useState, useEffect } from "react";
import { Form, Button, Badge } from "react-bootstrap";
import AppServices from "../service/app-service";
import useAlerts from "../context/useAlerts";

const SendMsgComponent = ({ leilaoId, showModalWp, fecharModal }) => {
  const [frete, setFrete] = useState([]);
  // eslint-disable-next-line
  const [veiculosFrete, setVeiculosFrete] = useState([]);
  const [texto, setTexto] = useState("");
  const [proprietariosAptos, setProprietariosAptos] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      if (showModalWp) {
        useAlerts.showLoading("Aguarde!");
        try {
          const freteResponse = await AppServices.listFreteById(leilaoId);
          const locaisColeta = await AppServices.listLocaisColetaById(
            freteResponse.data.local_origem
          );
          const ufColeta = await AppServices.listUfById(locaisColeta.data.uf);
          const ufDestino = await AppServices.listUfById(freteResponse.data.uf);
          const veiculosFreteResponse =
            await AppServices.listFreteVeiQNumLeilao(
              freteResponse.data.num_leilao
            );
          const tiposRodados = await AppServices.listTipoRodado();
          const tiposCarroceria = await AppServices.listTipoCarroceria();
          var produtos = await AppServices.listProdutoByLeilao(
            freteResponse.data.num_leilao
          );
          const unidadeMedida = await AppServices.listUnidadeMedidas();

          produtos.data.map((p) => {
            return p.unidadeMedida = unidadeMedida.data.filter(
              (uni) => p.uni_medida === uni.id
            );
          });
          var veiculosFind = [];
          var carroceriasFind = [];
          const veiculos = veiculosFreteResponse.data.map((vf) => {
            const tipoRodado = tiposRodados.data.find(
              (tr) => tr.id === vf.id_tipo_veiculo
            );
            const tipoCarroceria = tiposCarroceria.data.find(
              (tc) => tc.id === vf.id_tipo_carroceria
            );
            veiculosFind.push(tipoRodado.id);
            carroceriasFind.push(tipoCarroceria.id);
            return {
              veiculoFrete: vf,
              tipoRodado: tipoRodado ? tipoRodado : "Não encontrado",
              tipoCarroceria: tipoCarroceria
                ? tipoCarroceria
                : "Não encontrado",
            };
          });

          var data = { veiculosFind, carroceriasFind };
          const props = await AppServices.listProprietariosPorVeiculos(data);
          setProprietariosAptos(props.data);
          var frete = freteResponse.data;
          frete.localDeColeta = locaisColeta.data;
          frete.localDeColeta.regiao = ufColeta.data;
          frete.regiaoDestino = ufDestino.data;
          frete.produtos = produtos.data;

          let textoIn = `*Prezado transportador*,
Informamos que abrimos o leilão n°: ${
            frete.num_leilao
          } e convidamos para enviar seu lance. 
_Data da coleta na empresa:_ ${formatarData(frete.dt_coleta_ordem, true)}

_Data limite do lance:_ ${formatarData(frete.dt_validade_leilao, true)}

_Valor máximo do lance:_ *R$${frete.vl_lance_maximo}*
          
*Local de coleta:* 
${frete.localDeColeta.nome}, ${frete.localDeColeta.endereco} N° ${
            frete.localDeColeta.numero
          }, ${frete.localDeColeta.bairro} - ${frete.localDeColeta.cep} - ${
            frete.localDeColeta.cidade
          }/${frete.localDeColeta.regiao.uf}
          
*Local de entrega:*
${frete.razao_social}, ${frete.endereco_destino} N° ${frete.numero_destino}, ${
            frete.bairro_destino
          } - ${frete.cep_destino} - ${frete.cidade_destino}/${
            frete.regiaoDestino.uf
          }
  
*Carga e Veículos*
_Veículos_
          ${veiculos
            .map(
              (v) => `
- Tipo de veículo: ${
                v.tipoRodado ? v.tipoRodado.tipo_rodado : "Não encontrado"
              } 
- Tipo de carroceria: ${
                v.tipoCarroceria
                  ? v.tipoCarroceria.tipo_carroceria
                  : "Não encontrado"
              } 
Quantidade: ${v.veiculoFrete.quantidade}`
            )
            .join("\n")}

_Produtos_
${frete.produtos.map(
  (p) => `
- Conteúdo: ${p.produto} - ${p.quantidade} ${p.unidadeMedida[0].uni_medida}`
)}

*O valor do lance deve ser enviada juntamente com o número do leilão assim 'numeroLeilao;lance', exemplo: 99999;750 *`;

          setVeiculosFrete(veiculos);
          setTexto(textoIn);
          setFrete(frete);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        useAlerts.closeSwal();
      }
    };

    fetchData();
  }, [leilaoId, showModalWp]);

  const handleChange = (event) => {
    setTexto(event.target.value);
  };

  const renderProprietarios = () => {
    if (Array.isArray(proprietariosAptos)) {
      return proprietariosAptos.map((proprietario) => (
        <tr key={proprietario.id}>
          <td>{proprietario.id}</td>
          <td>{proprietario.nome}</td>
          <td>{proprietario.cpf_cnpj}</td>
          <td>{proprietario.email}</td>
          <td>{proprietario.ie}</td>
          <td>{formatPhoneNumber(proprietario.tel_whatsapp)}</td>
          <td>{formatPhoneNumber(proprietario.tel_contato)}</td>
        </tr>
      ));
    } else {
      return null;
    }
  };

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString)
      .replace(/^55/, "")
      .replace("@c.us", "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  const formatarData = (dataISO, toTela) => {
    const data = new Date(dataISO);

    const dia = data.getUTCDate().toString().padStart(2, "0");
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0"); // Os meses são indexados a partir de 0
    const ano = data.getUTCFullYear();

    if (!toTela) return `${ano}-${mes}-${dia}`;
    return `${dia}/${mes}/${ano}`;
  };

  const formatarNumeroParaEnvio = (numero) => {
    const numerosApenas = numero.replace(/\D/g, "");
    if (numerosApenas.length === 13) {
      return numerosApenas.slice(0, 4) + numerosApenas.slice(5) + "@c.us";
    }
    return numero;
  };

  const enviarWhatsapp = async () => {
    try {
      proprietariosAptos.map((pa) => {
        return pa.tel_whatsapp = formatarNumeroParaEnvio(pa.tel_whatsapp);
      });
      var numLeilao = frete.num_leilao;
      var data = { proprietariosAptos, texto , numLeilao};
      const res = await AppServices.senderAll(data);
      if (res.status === 201 && res.data.status !== 404) {
        useAlerts.senderMsgSuccess();
        frete.status = 2;
        frete.wp_enviado = 1;
        delete frete.localDeColeta;
        delete frete.regiaoDestino;
        delete frete.produtos;
        await AppServices.updateFrete(frete, frete.id);
        fecharModal();
      } else {
        useAlerts.showAlertError(res.data.message);
      }
    } catch (error) {
      useAlerts.showAlertError(error);
    }
  };

  return (
    <>
      <div>
        {frete.wp_enviado ? (
          <>
            <Badge pill bg="danger">
              Mensagem de início do leilão já enviada
            </Badge>
            <br />
          </>
        ) : (
          <>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Mensagem a enviar para os proprietários</Form.Label>
              <Form.Control
                as="textarea"
                rows={15}
                value={texto}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="success" onClick={() => enviarWhatsapp()}>
              Enviar mensagem
            </Button>
          </>
        )}
      </div>
      <br />
      {frete.wp_enviado ? (
        <>
          <h5>Proprietários participantes</h5>
        </>
      ) : (
        <h5>Proprietários aptos</h5>
      )}

      <br />
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover table-sm">
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">CPF/CNPJ</th>
              <th scope="col">Email</th>
              <th scope="col">IE</th>
              <th scope="col">Whatsapp</th>
              <th scope="col">Contato</th>
            </tr>
          </thead>
          <tbody>{renderProprietarios()}</tbody>
        </table>
      </div>
    </>
  );
};

export default SendMsgComponent;
