import Layout from "@components/_App/Layout";
import React from "react";
import { Provider } from "react-redux";

import createStore from "../src/redux/configureStore";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  const store = createStore(); // Create the store
  return (
    <Provider store={store}>
      <Layout pageProps={pageProps}>
        <Component store={store} pageProps={pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
