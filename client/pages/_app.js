import Layout from "@components/_App/Layout";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";

import createStore from "../src/redux/configureStore";
import "../styles/globals.scss";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000");

function MyApp({ Component, pageProps }) {
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const store = createStore(); // Create the store
  return (
    <Provider store={store}>
      <Layout pageProps={pageProps}>
        <Component
          store={store}
          pageProps={pageProps}
          socket={socket}
          userName={userName}
          setUserName={setUserName}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
        />
      </Layout>
    </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.any,
};

export default MyApp;
