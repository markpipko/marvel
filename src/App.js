import logo from './img/Marvel_Logo.png';
import './App.css';
import React from 'react';
import Home from './components/Home'
import Characters from './components/Characters';
import Comics from './components/Comics';
import Series from './components/Series';
import CharactersId from './components/CharactersId';
import ComicsId from './components/ComicsId';
import SeriesId from './components/SeriesId';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to the Marvel Site!</h1>
          <Link className='App-link' to='/characters/page/0'>
            Characters
					</Link>
					<Link className='App-link' to='/comics/page/0'>
            Comics
					</Link>
          <Link className='App-link' to='/series/page/0'>
            Series
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/characters/page/:page' component={Characters} />
            <Route exact path='/comics/page/:page' component={Comics} />
            <Route exact path='/series/page/:page' component={Series} />
            <Route exact path='/characters/:id' component={CharactersId} />
            <Route exact path='/comics/:id' component={ComicsId} />
            <Route exact path='/series/:id' component={SeriesId} />
            <Route component={NotFound} />
          </Switch>
				</div>
			</div>
		</Router>
  );
}

export default App;
