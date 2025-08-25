import api_nf from "../api/api-nf";

class NfService {

    //Serviços de NF
    criaNfCte(cte){ return api_nf.post(`/v2/cte?ref=${cte}`); }
    emiteNfCte(cte){ return api_nf.post(`/v2/cte_os?ref=${cte}`); }
    consultaNfCte(cte){ return api_nf.get(`/v2/cte/${cte}`); }
    cancelaNfCte(cte){ return api_nf.delete(`/v2/cte/${cte}`); }
    geraCartaCorrecaoNfCte(cte){ return api_nf.post(`/v2/cte/${cte}/carta_correcao`); }
    inutilizaNfCte(){ return api_nf.post(`/v2/cte/inutilizacao`); }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new NfService()