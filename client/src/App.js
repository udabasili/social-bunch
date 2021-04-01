import {BrowserRouter as Router} from 'react-router-dom';
import { store, persistor } from './redux/store';
import {
	PersistGate
} from 'redux-persist/integration/react';
import {Provider} from "react-redux";
import MainRoute from './MainRoute';
import "./assets/sass/main.scss"

function App() {
  return (
	<Provider store={store}>
        <PersistGate  persistor={persistor}>
          <Router>
            <MainRoute/>
          </Router>
        </PersistGate>
      </Provider>
  );
}

export default App;
