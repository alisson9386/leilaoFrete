import './App.css';
import './assets/style.scss'
import history from './history';
import { Switch, Router, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import ReplacePasswordComponent from './components/ReplacePasswordComponent';

function App() {
  return (
    <div>
				<Router history={history}>
						<Switch>
							<Route path="/" exact component={LoginComponent}/>
							<Route path="/replacePassword" component={ReplacePasswordComponent}/>
							<Route>
								<Switch>
								</Switch>
              </Route>
						</Switch>
				</Router>
		</div>
  );
}

export default App;
