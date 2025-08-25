import React, { Component } from "react";
import { Container, Nav } from "react-bootstrap";
import useAuth from "../../context/useAuth";
import history from "../../history";
import LocaisColetaComponent from "./Fretes/LocaisColeta";
import ProprietariosEditComponent from "./Proprietarios/Proprietario";
import TipoProprietarioComponent from "./Proprietarios/TipoProprietario";
import TipoUsuariosComponent from "./Usuarios/TipoUsuarios";
import UsuariosEditComponent from "./Usuarios/Usuarios";
import TipoCarroceriaComponent from "./Veiculo/TipoCarroceria";
import TipoRodadoVeiculoComponent from "./Veiculo/TipoRodadoVeiculo";

class AdminComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basicActive: "proprietarios",
    };
  }

  componentDidMount() {
    const myDecodedToken = useAuth.setAuthInfo();
    this.setState({ id: myDecodedToken.id });
    this.setState({ usuario: myDecodedToken.usuario });
    this.setState({ nome: myDecodedToken.nome });
    this.setState({ email: myDecodedToken.email });
    if (myDecodedToken.tipo_user !== 1) {
      history.push("/index");
    }
  }

  handleBasicClick = (value) => {
    if (value === this.state.basicActive) {
      return;
    }

    this.setState({ basicActive: value });
  };

  render() {
    const { basicActive } = this.state;
    return (
      <>
        <div className="containerAdmin">
          <br/><br/>
            <Nav
              variant="pills"
              defaultActiveKey="proprietarios"
              activeKey={basicActive}
              onSelect={this.handleBasicClick}
              className="justify-content-center"
              >
              <Nav.Item>
                <Nav.Link eventKey="proprietarios">Proprietários</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tipo_proprietario">
                  Tipos de proprietários
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="locais-coleta">Locais de coleta</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tipo_carroceria">
                  Tipos de carrocerias
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tipo_rodado">Tipos rodados</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="usuarios">Usuários do sistema</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tipo_usuario">Tipos de usuários</Nav.Link>
              </Nav.Item>
            </Nav>
              <Container>
            {basicActive === "proprietarios" && <ProprietariosEditComponent />}
            {basicActive === "tipo_usuario" && <TipoUsuariosComponent />}
            {basicActive === "tipo_carroceria" && <TipoCarroceriaComponent />}
            {basicActive === "tipo_rodado" && <TipoRodadoVeiculoComponent />}
            {basicActive === "tipo_proprietario" && (
              <TipoProprietarioComponent />
            )}
            {basicActive === "usuarios" && <UsuariosEditComponent />}
            {basicActive === "locais-coleta" && <LocaisColetaComponent />}
          </Container>
        </div>
      </>
    );
  }
}

export default AdminComponent;
