import React, { Component } from "react";
import useAuth from "../../context/useAuth";
import history from "../../history";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";

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
          <MDBTabs fill className='mb-3'>
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
                onClick={() => this.handleBasicClick("usuarios")}
                active={basicActive === "usuarios"}
              >
                Usuários
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane open={basicActive === "frete"}>
              Fretes
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "proprietarios"}>
             Proprietários
            </MDBTabsPane>
            <MDBTabsPane open={basicActive === "usuarios"}>
              Tab 3 content
            </MDBTabsPane>
          </MDBTabsContent>
        </>
      </div>
    );
  }
}

export default AdminComponent;
