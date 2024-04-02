import {
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBRow,
  MDBCol
} from "mdb-react-ui-kit";
import React, { Component } from "react";
import history from "../../history";
import ProprietariosEditComponent from "./Proprietarios/Proprietario";
import UsuariosEditComponent from "./Usuarios/Usuarios";
import useAuth from "../../context/useAuth";
import TipoProprietarioComponent from "./Proprietarios/TipoProprietario";
import TipoRodadoVeiculoComponent from "./Veiculo/TipoRodadoVeiculo";
import TipoCarroceriaComponent from "./Veiculo/TipoCarroceria";
import TipoUsuariosComponent from "./Usuarios/TipoUsuarios";
import LocaisColetaComponent from "./Fretes/LocaisColeta";

class AdminComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basicActive: "frete",
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
      <div className="containerAdmin">
        <br />
        <br />
        <>
        <MDBRow>
        <MDBCol size='12' md='3'>
          <MDBTabs className='flex-column text-center'>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("frete")}
                active={basicActive === "frete"}
              >
                Fretes
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("proprietarios")}
                active={basicActive === "proprietarios"}
              >
                Proprietarios
              </MDBTabsLink>
            </MDBTabsItem>

            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("tipo_usuario")}
                active={basicActive === "tipo_usuario"}
              >
                Tipos de usuários
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("tipo_carroceria")}
                active={basicActive === "tipo_carroceria"}
              >
                Tipos de carrocerias
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("tipo_rodado")}
                active={basicActive === "tipo_rodado"}
              >
                Tipos rodados
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("tipo_proprietario")}
                active={basicActive === "tipo_proprietario"}
              >
                Tipos de proprietários
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("usuarios")}
                active={basicActive === "usuarios"}
              >
                Usuários
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => this.handleBasicClick("locais-coleta")}
                active={basicActive === "locais-coleta"}
              >
                Locais de coleta
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
          </MDBCol>
          <MDBCol size='12' md='9'>
          <MDBTabsContent>
            <MDBTabsPane open={basicActive === "frete"}>
              Fretes
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "proprietarios"}>
             <ProprietariosEditComponent/>
            </MDBTabsPane>

            <MDBTabsPane open={basicActive === "tipo_usuario"}>
              <TipoUsuariosComponent/>
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "tipo_carroceria"}>
              <TipoCarroceriaComponent/>
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "tipo_rodado"}>
              <TipoRodadoVeiculoComponent/>
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "tipo_proprietario"}>
              <TipoProprietarioComponent/>
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "usuarios"}>
              <UsuariosEditComponent/>
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "locais-coleta"}>
              <LocaisColetaComponent/>
            </MDBTabsPane>
          </MDBTabsContent>
          </MDBCol>
          </MDBRow>
        </>
      </div>
    );
  }
}

export default AdminComponent;
