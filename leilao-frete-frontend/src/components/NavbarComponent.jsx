import React, { Component } from 'react'
import history from '../history';
import useAuth from '../context/useAuth';
import { isExpired, decodeToken } from 'react-jwt';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Cookies from 'js-cookie';
import logo from '../assets/img/logo.png';
import { BsPersonCircle, BsFillGearFill, BsDashCircle, BsTruck, BsFillPersonPlusFill, BsClipboard2Fill } from "react-icons/bs";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

class NavbarComponent extends Component {
    
    showAlertUserAuthenticated = () => {
        Toast.fire({
            icon: 'info',
            title: 'Acesso expirado, necessário refazer o login',
        });	
    }
    
    constructor(props){
        super(props)

        this.state = {
            id:'',
            tipo_user:'',
            usuario:'',
            nome:'',
            setor_user:'',
            imgPerfil:'',
        }
    }
    
    componentDidMount(){
        const token = Cookies.get('token');
        const myDecodedToken = decodeToken(token);
        const isMyTokenExpired = isExpired(token);
        if(isMyTokenExpired){
            useAuth.handleLogout();
        }else if(!isMyTokenExpired){
            this.setState({id: myDecodedToken.user.id});
            this.setState({tipo_user: myDecodedToken.user.tipo_user});
            this.setState({usuario: myDecodedToken.user.usuario});
            this.setState({nome: myDecodedToken.user.nome});
            this.setState({setor_user: myDecodedToken.user.setor_user});
            console.log(myDecodedToken)

        }
    }


    logout(){
        useAuth.handleLogout();
        history.push("/");
    }

    render() {
        const tipoUser = this.state.tipo_user;
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand href="/index"><img src={logo} className="img-thumbnail" alt="..." width="50" height="50" style={{ borderRadius: "50%", margin: "auto" }}></img></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/index">Início</Nav.Link>
                        <NavDropdown title="Fretes" id="basic-nav-dropdown">
                            <NavDropdown.Item href=""><BsClipboard2Fill/> Meus fretes</NavDropdown.Item>
                            <NavDropdown.Item href=""><BsTruck/> Novo frete</NavDropdown.Item>
                            <NavDropdown.Item href=""><BsFillPersonPlusFill/> Cadastrar freteiro</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav className="me-auto">
                        <NavDropdown title={
                            // eslint-disable-next-line
                            <Navbar.Text> Bem vindo, <a href=''>{this.state.usuario}</a>
                            </Navbar.Text>
                        }>
                            <NavDropdown.Item href="/perfil"><BsPersonCircle/>  Meu perfil</NavDropdown.Item>
                            {tipoUser === 1 ? (<NavDropdown.Item href="/admin"><BsFillGearFill/>  Administração</NavDropdown.Item>) : (<></>)}
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#" onClick={this.logout}>
                                <BsDashCircle style={{ color: 'red' }}/>  Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                            
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default NavbarComponent;