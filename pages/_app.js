import Layout from "@components/_App/Layout";
import React from "react";
import { Provider } from "react-redux";
import "../styles/globals.scss";

function MyApp({ Component, store, pageProps, isServer }) {
  return (
    <Provider store={store}>
      <Layout {...pageProps}>
        <Component {...pageProps} isServer={isServer} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
