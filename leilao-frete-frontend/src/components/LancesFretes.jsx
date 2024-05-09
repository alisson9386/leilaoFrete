import React, { useState, useEffect } from "react";
import AppServices from "../service/app-service";
import useAlerts from "../context/useAlerts";

const LancesFreteComponent = ({ leilaoId, showModalLances, fecharModal }) => {
  const [frete, setFrete] = useState([]);
  useEffect(() => {
    console.log(leilaoId, showModalLances, fecharModal);
    return () => {
      // Equivalente a componentWillUnmount
    };
  }, []); // Array vazio como segundo argumento para garantir que o efeito seja executado apenas uma vez, equivalente a componentDidMount

  return (
    <div>
      Testes
    </div>
  );
};

export default LancesFreteComponent;
