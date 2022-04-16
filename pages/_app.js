import Layout from "@components/_App/Layout";
import React from "react";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
