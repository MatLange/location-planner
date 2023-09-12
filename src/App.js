import Map from './Map'
import logo from './logo.svg';
import { Helmet } from "react-helmet";
import './App.css';


import { Provider, ReactReduxContext } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './app/reducer/reducer';
import { createContext } from 'vm';
import actionCreators from './app/actions/actions';
import { getHashValues } from './app/utils/utils';

let store = createStore(rootReducer, applyMiddleware(thunk))  
let customContext = React.createContext(null);

function App() {
  return (
<Provider store={store} context={ReactReduxContext}>
     <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div> 
    </Provider>
  );
}

function mapStateToProps() {
  const getEventArray = createSelector(
    (state) => state.eventsById,
    getHashValues
  )

  return (state) => {
    return {
      events: getEventArray(state),
      weekendsVisible: state.weekendsVisible
    }
  }
}


export default connect(mapStateToProps, actionCreators)(App);