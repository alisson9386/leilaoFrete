import Cookies from "js-cookie";
import {
  MDBCollapse,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";
import React, { Component } from "react";
import { NavDropdown, Navbar } from 'react-bootstrap';
import {
  BsDashCircle,
  BsFillGearFill,
  BsPersonCircle,
  BsPersonGear,
  BsTruck,
} from "react-icons/bs";
import { FcHighPriority, FcOk } from "react-icons/fc";
import logo from "../assets/img/transitti.jpeg";
import useAlerts from "../context/useAlerts";
import useAuth from "../context/useAuth";
import history from "../history";
import AppServices from "../service/app-service";

class NavbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      tipo_user: "",
      usuario: "",
      nome: "",
      setor_user: "",
      imgPerfil: "",
      whatsappStatus: false,
      openBasic: false,
      
    };
  }

  async componentDidMount() {
    if(Cookies.get("token")){
      const myDecodedToken = useAuth.setAuthInfo();
      this.setState({ id: myDecodedToken.id });
      this.setState({ usuario: myDecodedToken.usuario });
      this.setState({ nome: myDecodedToken.nome });
      this.setState({ email: myDecodedToken.email });
      this.setState({ tipo_user: myDecodedToken.tipo_user });
      const whatsappStatus = await AppServices.statusServidor();
      if (whatsappStatus.data != null) {
        this.setState({ whatsappStatus: whatsappStatus.data[0] });
      }else{
        useAlerts.showAlertUserAuthenticated();
        this.logout();
      }
  
      setTimeout(() => {
        let time = !this.state.whatsappStatus ? 5000 : 30000;
        this.intervalId = setInterval(this.fetchData, time);
      }, 30000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  toggleBasic = () => {
    this.setState((prevState) => ({ openBasic: !prevState.openBasic }));
  };

  fetchData = async () => {
    try {
      const whatsappStatus = await AppServices.statusServidor();
      if(whatsappStatus.status === 401){
        this.logout();
      }
      if (whatsappStatus.data != null) {
        this.setState({ whatsappStatus: whatsappStatus.data[0] });
      } else {
        this.setState({ whatsappStatus: false });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  logout() {
    useAuth.handleLogout();
    history.push("/");
  }

  render() {
    const tipoUser = this.state.tipo_user;
    const whatsappStatus = this.state.whatsappStatus;
    const { openBasic } = this.state;
    return (
      <>
        <MDBNavbar className="fixed-top" expand="lg" dark bgColor="dark">
          <MDBContainer fluid>
            <MDBNavbarBrand href="/index">
              <img
                src={logo}
                alt="..."
                width="50"
                height="50"
                style={{ borderRadius: "50%", margin: "auto" }}
              ></img>
            </MDBNavbarBrand>

            <MDBNavbarToggler
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.toggleBasic}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>

            <MDBCollapse navbar open={openBasic}>
              <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                <MDBNavbarItem>
                  <MDBNavbarLink active aria-current="page" href="/index">
                    Início
                  </MDBNavbarLink>
                </MDBNavbarItem>

                <MDBNavbarItem>
                  <MDBDropdown>
                    <MDBDropdownToggle
                      tag="a"
                      className="nav-link"
                      role="button"
                    >
                      Fretes
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link href="/fretes">
                        <BsTruck /> Leilão
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavbarItem>
              </MDBNavbarNav>

              {tipoUser === 1 ? (
                <MDBNavbarBrand className="meu-navbar-brand">
                  <MDBNavbarLink href="/statusWhatsapp">
                    <span>
                      Whatsapp {whatsappStatus ? <FcOk /> : <FcHighPriority />}
                    </span>
                  </MDBNavbarLink>
                </MDBNavbarBrand>
              ) : (
                <></>
              )}
              <NavDropdown
                title={
                  <Navbar.Text>
                    {" "}
                    Configurações <BsPersonGear />
                  </Navbar.Text>
                }
              >
                <NavDropdown.Item href="/perfil">
                  <BsPersonCircle /> Meu perfil
                </NavDropdown.Item>
                {tipoUser === 1 ? (
                  <NavDropdown.Item href="/admin">
                    <BsFillGearFill /> Administração
                  </NavDropdown.Item>
                ) : (
                  <></>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item href="#" onClick={this.logout}>
                  <BsDashCircle style={{ color: "red" }} /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </>
    );
  }
}

export default NavbarComponent;
