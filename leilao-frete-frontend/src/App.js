import './App.css';
//import './assets/style.scss'
import './index.css';
import history from './history';
import { Switch, Router, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import ReplacePasswordComponent from './components/ReplacePasswordComponent';
import NavbarComponent from './components/NavbarComponent';
import HomeComponent from './components/HomeComponent';
import PerfilComponent from './components/PerfilComponent';
import Layout from './components/Layout';
import StatusWhatsappComponent from './components/admin/StatusWhatsapp';
import AdminComponent from './components/admin/Admin';
import ModeloComponent from './components/Modelo';

function App() {
  return (
    <div>
				<Router history={history}>
						<Switch>
							<Route path="/" exact component={LoginComponent}/>
							<Route path="/replacePassword" component={ReplacePasswordComponent}/>
									<Route path="/modelo" component={ModeloComponent}/>
							<Route>
								<NavbarComponent/>
								<Switch>
								<Layout>
									<Route path="/index" component={HomeComponent}/>
									<Route path="/perfil" component={PerfilComponent}/>
									<Route path="/statusWhatsapp" component={StatusWhatsappComponent}/>
									<Route path="/admin" component={AdminComponent}/>


								</Layout>
								</Switch>
              </Route>
						</Switch>
				</Router>
		</div>
  );
}

export default App;
