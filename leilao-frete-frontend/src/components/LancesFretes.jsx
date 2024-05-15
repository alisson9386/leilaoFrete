import React, { useState, useEffect } from "react";
import AppServices from "../service/app-service";
import useAlerts from "../context/useAlerts";

const LancesFreteComponent = ({ leilaoId, showModalLances, fecharModal }) => {
  const [frete, setFrete] = useState([]);

  useEffect(() => {
    const fetchData = async () =>{
      if(showModalLances){
        useAlerts.showLoading('Aguarde!');
        const freteResponse = await AppServices.listFreteById(leilaoId);
        setFrete(freteResponse.data);
        useAlerts.closeSwal();
      }
    };

    fetchData();
  }, [leilaoId, showModalLances, fecharModal]); // Array vazio como segundo argumento para garantir que o efeito seja executado apenas uma vez, equivalente a componentDidMount

  return (
    <div>
      Testes
    </div>
  );
};

export default LancesFreteComponent;
