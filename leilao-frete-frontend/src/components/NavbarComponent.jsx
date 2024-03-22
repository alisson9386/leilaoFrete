import React, { Component } from "react";
import history from "../history";
import useAuth from "../context/useAuth";
import Swal from "sweetalert2";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/img/logo.png";
import {
  BsPersonCircle,
  BsFillGearFill,
  BsDashCircle,
  BsTruck,
  BsPersonGear,
} from "react-icons/bs";
import AppServices from "../service/app-service";
import { FcOk, FcHighPriority } from "react-icons/fc";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

class NavbarComponent extends Component {
  showAlertUserAuthenticated = () => {
    Toast.fire({
      icon: "info",
      title: "Acesso expirado, necessário refazer o login",
    });
  };

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
    const myDecodedToken = useAuth.setAuthInfo();
    this.setState({ id: myDecodedToken.id });
    this.setState({ usuario: myDecodedToken.usuario });
    this.setState({ nome: myDecodedToken.nome });
    this.setState({ email: myDecodedToken.email });
    this.setState({ tipo_user: myDecodedToken.tipo_user });
    const whatsappStatus = await AppServices.statusServidor();
    if (whatsappStatus.data != null) {
      this.setState({ whatsappStatus: whatsappStatus.data[0] });
    }

    setTimeout(() => {
      let time = !this.state.whatsappStatus ? 5000 : 30000;
      this.intervalId = setInterval(this.fetchData, time);
    }, 30000);
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
        <MDBNavbar expand="lg" dark bgColor="dark">
          <MDBContainer fluid>
            <MDBNavbarBrand href="/index">
              <img
                src={logo}
                className="img-thumbnail"
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
                        <BsTruck /> Fretes
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
