import {BrowserRouter as Router} from 'react-router-dom';
import { store, rrfProps } from './redux/store';
import {Provider} from "react-redux";
import MainRoute from './MainRoute';
import "./assets/sass/main.scss"
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'

function App() {
  return (
	<Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
        <Router>
          <MainRoute/>
        </Router>
    </ReactReduxFirebaseProvider>
  </Provider>
  );
}

export default App;
