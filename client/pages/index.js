import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";

const Home = ({ socket, userName, setUserName, roomCode, setRoomCode }) => {
  const [shouldRoomCodeAutoFocus, setShouldAutoFocus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const input = document.getElementById("username-ip");
    input?.focus();
  }, []);

  const joinRoom = ({ userName, roomCode }) => {
    socket.emit("join_room", { username: userName, room: roomCode });
    router.push("/gamePage");
  };

  return (
    <div
      className={styles.container}
      onKeyDown={(e) => {
        if (!userName || isNaN(roomCode) || roomCode.length < 6) {
          return;
        }
        if (e.code === "Enter") {
          joinRoom({ userName, roomCode });
        }
      }}
    >
      <div className={styles.formContainer}>
        <h1>Tambola</h1>

        <div className="w-100">
          <div>Username</div>
          <input
            id="username-ip"
            className="mt-2 w-100"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter" && userName) {
                setShouldAutoFocus(true);
              }
            }}
          />
        </div>

        <div className="w-100">
          <div className="mb-2">Room Code</div>
          <OtpInput
            value={roomCode}
            onChange={setRoomCode}
            shouldAutoFocus={shouldRoomCodeAutoFocus}
            numInputs={6}
            inputType="number"
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
          onClick={() => joinRoom({ userName, roomCode })}
        >
          Enter Room
        </button>
      </div>
    </div>
  );
};

export default Home;
