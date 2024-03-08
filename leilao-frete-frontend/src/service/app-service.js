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

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BackService()