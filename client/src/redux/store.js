import rootReducer from "./rootReducer";
import {createStore, compose, applyMiddleware} from "redux";
import {persistStore} from "redux-persist";
import thunk from "redux-thunk";

const middleware = [thunk]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(...middleware)
))

export const persistor = persistStore(store)

export default {store, persistor};

