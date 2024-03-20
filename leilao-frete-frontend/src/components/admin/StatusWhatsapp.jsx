import React, { Component } from "react";
import AppServices from "../../service/app-service";
import useAuth from "../../context/useAuth";
import QRCode from "qrcode.react";
//import Swal from 'sweetalert2';
import history from "../../history";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import imgCheck from "../../assets/img/check.png";
import { MDBCardImage } from "mdb-react-ui-kit";

class StatusWhatsappComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whatsappStatus: "",
      whatsappQrcode: "",
      whatsappStatusCode: 0,
    };
  }

  async componentDidMount() {
    const myDecodedToken = useAuth.setAuthInfo();
    if (myDecodedToken.tipo_user !== 1) {
      history.push("/index");
    }
    const whatsappStatus = await AppServices.statusServidor();
    if (whatsappStatus.data != null) {
      let status = whatsappStatus.data[0] ? "Conectado" : "Desconectado";
      this.setState({ whatsappStatus: status });
      this.setState({ whatsappStatusCode: whatsappStatus.data[0] });
      this.setState({ whatsappQrcode: whatsappStatus.data[1] });
    }

    setTimeout(() => {
      this.intervalId = setInterval(this.fetchData, 5000);
    }, []);
  }

  reload = () => {
    window.location.reload();
  };

  fetchData = async () => {
    try {
      const whatsappStatus = await AppServices.statusServidor();
      if (whatsappStatus.data != null) {
        let status = whatsappStatus.data[0] ? "Conectado" : "Desconectado";
        this.setState({
          whatsappStatus: status,
          whatsappStatusCode: whatsappStatus.data[0],
          whatsappQrcode: whatsappStatus.data[1],
        });
      } else {
        this.setState({ whatsappStatus: false });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  render() {
    const status = this.state.whatsappStatus;
    const statusCode = this.state.whatsappStatusCode;
    const statusStyle = {
      fontWeight: "bold",
      color: status === "Conectado" ? "green" : "red",
    };
    const qrCodeSize = 200;
    return (
      <>
        <div className="containerQrCodeWhatsapp d-flex justify-content-center align-items-center vh-100">
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>WhatsappWeb</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Status : <span style={statusStyle}>{status}</span>
              </Card.Subtitle>
              <Card.Text>
                {!statusCode ? (
                  <>
                    <p>QrCode :</p>
                    <QRCode
                      value={this.state.whatsappQrcode}
                      size={qrCodeSize}
                    />
                    <Button onClick={this.reload}>Gerar novo QrCode</Button>
                  </>
                ) : (
                  <>
                    <MDBCardImage
                      src={imgCheck}
                      className="rounded-circle"
                      fluid
                      style={{ width: "100px" }}
                    />
                  </>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }
}

export default StatusWhatsappComponent;
