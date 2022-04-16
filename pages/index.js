import React from "react";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    // This is the landing screen. It asks the user to either join the existing room or create a new one.
    // ToDo: Find a way to create a new room and redirect to the game screen. This is some new stuff.
    <div className={styles.container}>
      {/* Show a button which says Join the room and when clicked takes to a page where user enters the code and goes into the page */}
      <button className={styles.button}>Join the room</button>
      {/* Show a button which says Create a new room and when clicked takes to a page where user enters the code and goes into the page */}
      <button className={styles.button}>Create a new room</button>
    </div>
  );
}
