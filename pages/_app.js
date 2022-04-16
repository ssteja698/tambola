import Layout from "@components/_App/Layout";
import React from "react";
import { Provider } from "react-redux";
import "../styles/globals.scss";

function MyApp({ Component, store, pageProps }) {
  return (
    // <Provider store={store}>
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
    // </Provider>
  );
}

export default MyApp;
