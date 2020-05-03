import React from 'react';
import {Provider} from "react-redux";
import { store, persistor } from './redux/store';
import { BrowserRouter as Router } from "react-router-dom";
import MainRouter from './MainRoute';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate  persistor={persistor}>
          <Router>
            <MainRouter/>
          </Router>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
}

export default App;
