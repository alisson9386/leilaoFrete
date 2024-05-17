import api_leilao from "../api/api-leilao";

class BackService {

    //Serviços de usuários
    loginUser(access){ return api_leilao.post('/users/login', access); }
    listUsers(){ return api_leilao.get('/users/'); }
    listUserById(idUser){ return api_leilao.get('/users/' + idUser); }
    saveUser(user){ return api_leilao.post('/users/', user); }
    updateUser(user, idUser){ return api_leilao.patch('/users/' + idUser, user); }
    deleteUser(idUser){ return api_leilao.delete('/users/' + idUser); }
    getUser(user){return api_leilao.get('/users/user/' + user); }

    //Serviços de whatsapp
    senderAll(data){ return api_leilao.post('/whatsapp/all', data);}
    statusServidor(){ return api_leilao.get('/whatsapp/statusServidor');}

    //Serviços de tipo_user
    listTipoUser(){ return api_leilao.get('/tipo-users/'); }
    listTipoUserById(idTipoUser){ return api_leilao.get('/tipo-users/' + idTipoUser); }
    saveTipoUser(tipoUser){ return api_leilao.post('/tipo-users/', tipoUser); }
    updateTipoUser(baia, idTipoUser){ return api_leilao.patch('/tipo-users/' + idTipoUser, baia); }
    deleteTipoUser(idTipoUser){ return api_leilao.delete('/tipo-users/' + idTipoUser); }

    //Serviços de proprietários
    listProprietarios(){ return api_leilao.get('/proprietario/'); }
    listProprietariosById(idProprietario){ return api_leilao.get('/proprietario/' + idProprietario); }
    listProprietariosPorVeiculos(veiculos){ return api_leilao.post('/proprietario/porveiculos', veiculos)}
    saveProprietarios(idProprietario){ return api_leilao.post('/proprietario/', idProprietario); }
    updateProprietarios(proprietario, idProprietario){ return api_leilao.patch('/proprietario/' + idProprietario, proprietario); }
    deleteProprietarios(idProprietario){ return api_leilao.delete('/proprietario/' + idProprietario); }
    alterarStatusProprietario(idProprietario){ return api_leilao.get('/proprietario/status/' + idProprietario); }

    //Serviços de tipo de proprietários
    listTipoProprietarios(){ return api_leilao.get('/tipo-proprietario/'); }
    listTipoProprietariosById(idTipoProprietario){ return api_leilao.get('/tipo-proprietario/' + idTipoProprietario); }
    saveTipoProprietarios(idTipoProprietario){ return api_leilao.post('/tipo-proprietario/', idTipoProprietario); }
    updateTipoProprietarios(tipoProprietario, idTipoProprietario){ return api_leilao.patch('/tipo-proprietario/' + idTipoProprietario, tipoProprietario); }
    deleteTipoProprietarios(idTipoProprietario){ return api_leilao.delete('/tipo-proprietario/' + idTipoProprietario); }

    //Serviços de uf
    listUf(){ return api_leilao.get('/uf/'); }
    listUfById(idUf){ return api_leilao.get('/uf/' + idUf); }
    saveUf(idUf){ return api_leilao.post('/uf/', idUf); }
    updateUf(uf, idUf){ return api_leilao.patch('/uf/' + idUf, uf); }
    deleteUf(idUf){ return api_leilao.delete('/uf/' + idUf); }

    //Serviços de tipo rodado
    listTipoRodado(){ return api_leilao.get('/tipo-rodado-veiculo/'); }
    listTipoRodadoById(idTipoRodado){ return api_leilao.get('/tipo-rodado-veiculo/' + idTipoRodado); }
    saveTipoRodado(idTipoRodado){ return api_leilao.post('/tipo-rodado-veiculo/', idTipoRodado); }
    updateTipoRodado(tipoRodado, idTipoRodado){ return api_leilao.patch('/tipo-rodado-veiculo/' + idTipoRodado, tipoRodado); }
    deleteTipoRodado(idTipoRodado){ return api_leilao.delete('/tipo-rodado-veiculo/' + idTipoRodado); }

    //Serviços de tipo carroceria
    listTipoCarroceria(){ return api_leilao.get('/tipo-carroceria-veiculo/'); }
    listTipoCarroceriaById(idTipoCarroceria){ return api_leilao.get('/tipo-carroceria-veiculo/' + idTipoCarroceria); }
    saveTipoCarroceria(idTipoCarroceria){ return api_leilao.post('/tipo-carroceria-veiculo/', idTipoCarroceria); }
    updateTipoCarroceria(tipoCarroceria, idTipoCarroceria){ return api_leilao.patch('/tipo-carroceria-veiculo/' + idTipoCarroceria, tipoCarroceria); }
    deleteTipoCarroceria(idTipoCarroceria){ return api_leilao.delete('/tipo-carroceria-veiculo/' + idTipoCarroceria); }

    //Serviços de veiculo
    listVeiculos(){ return api_leilao.get('/veiculo/'); }
    listVeiculosByProprietario(idProprietario){ return api_leilao.get('/veiculo/proprietario/' + idProprietario)}
    listVeiculoById(idVeiculo){ return api_leilao.get('/veiculo/' + idVeiculo); }
    saveVeiculo(idVeiculo){ return api_leilao.post('/veiculo/', idVeiculo); }
    updateVeiculo(veiculo, idVeiculo){ return api_leilao.patch('/veiculo/' + idVeiculo, veiculo); }
    deleteVeiculo(idVeiculo){ return api_leilao.delete('/veiculo/' + idVeiculo); }

    //Serviços de locais de coleta
    listLocaisColeta(){ return api_leilao.get('/locais-coleta/'); }
    listLocaisColetaById(idLocaisColeta){ return api_leilao.get('/locais-coleta/' + idLocaisColeta); }
    saveLocaisColeta(idLocaisColeta){ return api_leilao.post('/locais-coleta/', idLocaisColeta); }
    updateLocaisColeta(locaisColeta, idLocaisColeta){ return api_leilao.patch('/locais-coleta/' + idLocaisColeta, locaisColeta); }
    deleteLocaisColeta(idLocaisColeta){ return api_leilao.delete('/locais-coleta/' + idLocaisColeta); }

    //Serviços de fretes
    listFretes(){ return api_leilao.get('/fretes/'); }
    listFreteById(idFretes){ return api_leilao.get('/fretes/' + idFretes); }
    saveFrete(idFretes){ return api_leilao.post('/fretes/', idFretes); }
    updateFrete(fretes, idFretes){ return api_leilao.put('/fretes/' + idFretes, fretes); }
    deleteFrete(idFretes){ return api_leilao.delete('/fretes/' + idFretes); }

    //Serviços de unidade de medidas
    listUnidadeMedidas(){ return api_leilao.get('/unidade-medida/'); }
    listUnidadeMedidaById(idUnidadeMedida){ return api_leilao.get('/unidade-medida/' + idUnidadeMedida); }
    saveUnidadeMedida(idUnidadeMedida){ return api_leilao.post('/unidade-medida/', idUnidadeMedida); }
    updateUnidadeMedida(unidadeMedida, idUnidadeMedida){ return api_leilao.put('/unidade-medida/' + idUnidadeMedida, unidadeMedida); }
    deleteUnidadeMedida(idUnidadeMedida){ return api_leilao.delete('/unidade-medida/' + idUnidadeMedida); }

    //Serviços de produtos
    listProdutos(){ return api_leilao.get('/produtos-leilao/'); }
    listProdutoId(idProduto){ return api_leilao.get('/produtos-leilao/' + idProduto); }
    listProdutoByLeilao(numLeilao){ return api_leilao.get('produtos-leilao/numLeilao/' + numLeilao)}
    saveProduto(idProduto){ return api_leilao.post('/produtos-leilao/', idProduto); }
    updateProduto(produto, idProduto){ return api_leilao.put('/produtos-leilao/' + idProduto, produto); }
    deleteProduto(idProduto){ return api_leilao.delete('/produtos-leilao/' + idProduto); }

    //Serviços de frete-veiculos-quantidade
    listFreteVeiQNumLeilao(numLeilao){ return api_leilao.get('/frete-veiculo-quantidade/byLeilao/' + numLeilao); }
    
    //Serviços de lances-frete
    listLancesFreteByLeilao(numLeilao){ return api_leilao.get('/lances-frete/byLeilao/' + numLeilao); }


}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BackService()