import React, { Component } from 'react'
import { isExpired, decodeToken } from 'react-jwt';
import Cookies from 'js-cookie';
import AppServices from '../../service/app-service'
import useAuth from '../../context/useAuth';
import QRCode from 'qrcode.react';
//import Swal from 'sweetalert2';
import history from '../../history';
//import history from '../../history';


class StatusWhatsappComponent extends Component {
    constructor(props) {
		super(props)

		this.state = {
            whatsappStatus: '',
            whatsappQrcode: '',
            whatsappStatusCode: 0
		}
	}

    async componentDidMount(){

        const token = Cookies.get('token');
        const myDecodedToken = decodeToken(token);
        const isMyTokenExpired = isExpired(token);
        if(isMyTokenExpired){
            useAuth.handleLogout();
        }
        if(myDecodedToken.user.tipo_user !== 1){
            history.push('/index')
        }
        const whatsappStatus = await AppServices.statusServidor();
        if (whatsappStatus.data != null) {
            let status = whatsappStatus.data[0] ? 'Conectado' : 'Desconectado';
            this.setState({ whatsappStatus: status });
            this.setState({ whatsappStatusCode: whatsappStatus.data[0]})
            this.setState({ whatsappQrcode: whatsappStatus.data[1] });
        }

        setTimeout(() => {
            this.intervalId = setInterval(this.fetchData, 5000);
        }, []);
    }

    fetchData = async () => {
        try {
            const whatsappStatus = await AppServices.statusServidor();
            if (whatsappStatus.data != null) {
                let status = whatsappStatus.data[0] ? 'Conectado' : 'Desconectado';
                this.setState({ 
                    whatsappStatus: status,
                    whatsappStatusCode: whatsappStatus.data[0],
                    whatsappQrcode: whatsappStatus.data[1]
                });
            }else{
                this.setState({ whatsappStatus: false });
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    render() {
        const status = this.state.whatsappStatus;
        const statusCode = this.state.whatsappStatusCode;
        const statusStyle = {
            fontWeight: 'bold',
            color: status === 'Conectado' ? 'green' : 'red'
        };
        const qrCodeSize = 200;
        return (
            <div className='containerPerfilView'>
                <br/><br/><br/><br/>
                <h3>Status whatsapp</h3>
                <p>Status : <span style={statusStyle}>{status}</span></p>
                {!statusCode ? (<><p>QrCode :</p><QRCode value={this.state.whatsappQrcode} size={qrCodeSize} /></>) : (<></>)}
            </div>
        )
    }
}

export default StatusWhatsappComponent;