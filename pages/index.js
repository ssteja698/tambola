import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";

const Home = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <div
      className={styles.container}
      onKeyDown={(e) => {
        if (!userName || isNaN(roomCode) || roomCode.length < 6) {
          return;
        }
        if (e.code === "Enter") {
          router.push(`/gamePage?userName=${userName}&roomCode=${roomCode}`);
        }
      }}
    >
      <div className={styles.formContainer}>
        <h1>Tambola</h1>

        <div className="w-100">
          <div>Username</div>
          <input
            className="mt-2 w-100"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="w-100">
          <div className="mb-2">Room Code</div>
          <OtpInput
            value={roomCode}
            onChange={setRoomCode}
            numInputs={6}
            inputType="number"
            shouldAutoFocus
            renderSeparator={<span className="px-1"></span>}
            renderInput={(props) => (
              <input {...props} style={{ width: "100%" }} />
            )}
          />
        </div>

        <button
          className={`btn ${
            !isNaN(roomCode) && roomCode.length === 6
              ? "btn-primary"
              : "btn-secondary"
          }`}
          disabled={!userName || isNaN(roomCode) || roomCode.length < 6}
          style={{ width: "100%" }}
          onClick={() =>
            router.push(`/gamePage?userName=${userName}&roomCode=${roomCode}`)
          }
        >
          Enter Room
        </button>
      </div>
    </div>
  );
};

export default Home;
