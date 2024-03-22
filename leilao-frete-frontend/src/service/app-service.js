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
    senderAll(){ return api_leilao.get('/whatsapp/all');}
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
    saveProprietarios(idProprietario){ return api_leilao.post('/proprietario/', idProprietario); }
    updateProprietarios(proprietario, idProprietario){ return api_leilao.patch('/proprietario/' + idProprietario, proprietario); }
    deleteProprietarios(idProprietario){ return api_leilao.delete('/proprietario/' + idProprietario); }

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

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BackService()