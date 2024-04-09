import "./App.css";
//import './assets/style.scss'
import { Route, Router, Switch } from "react-router-dom";
import FooterComponent from "./components/FooterComponent";
import FretesComponent from "./components/FretesComponent";
import HomeComponent from "./components/HomeComponent";
import Layout from "./components/Layout";
import LoginComponent from "./components/LoginComponent";
import ModeloComponent from "./components/Modelo";
import NavbarComponent from "./components/NavbarComponent";
import PerfilComponent from "./components/PerfilComponent";
import ReplacePasswordComponent from "./components/ReplacePasswordComponent";
import AdminComponent from "./components/admin/Admin";
import StatusWhatsappComponent from "./components/admin/StatusWhatsapp";
import history from "./history";
import "./index.css";

function App() {
  return (
     <div>
       <Router history={history}>
         <Switch>
           <Route path="/" exact component={LoginComponent} />
           <Route path="/replacePassword" component={ReplacePasswordComponent} />
           <Route path="/modelo" component={ModeloComponent} />
           <Route>
             <NavbarComponent />
               <Switch>
                 <Layout>
                  <Route path="/index" component={HomeComponent} />
                  <Route path="/perfil" component={PerfilComponent} />
                  <Route
                     path="/statusWhatsapp"
                     component={StatusWhatsappComponent}
                  />
                  <Route path="/admin" component={AdminComponent} />
                  <Route path="/fretes" component={FretesComponent} />
                 </Layout>
               </Switch>
             <FooterComponent/>
           </Route>
         </Switch>
       </Router>
     </div>
  );
 }
 

export default App;
