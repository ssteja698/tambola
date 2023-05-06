import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import { config } from "../config";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error,
  diff: true,
});

function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  let middlewares = [sagaMiddleware, logger];
  if (config.env === "development") middlewares = [...middlewares];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const logoutResetEnhancer = (rootReducer) => (state, action) => {
    const { cancelToken, ...reset } = action.payload || {};
    if (action.type !== "LOGOUT_SUCCESS") return rootReducer(state, {
      ...action,
      payload: reset
    });
    const newState = rootReducer(undefined, {});
    return newState;
  };

  const store = createStore(
    logoutResetEnhancer(rootReducer),
    initialState,
    composedEnhancers
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
}

export default configureStore;
