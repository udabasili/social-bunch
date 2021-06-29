import {BrowserRouter as Router} from 'react-router-dom';
import { store, rrfProps, persistor } from './redux/store';
import {Provider} from "react-redux";
import MainRoute from './MainRoute';
import "./assets/sass/main.scss"
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { PersistGate } from 'redux-persist/integration/react'
import LoadingMessage from './components/splash/LoadingMessage';

function App() {
  return (
	<Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
        <PersistGate loading={<LoadingMessage/>} persistor={persistor}>
            <Router>
            <MainRoute/>
            </Router>
        </PersistGate>
        </ReactReduxFirebaseProvider>
  </Provider>
  );
}

export default App;
