import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useGameDetails, {
  gameInitialState,
} from "@components/Home/useGameDetails";
import RoomAndUsers from "@components/Screens/LandingPage/RoomAndUsers";
import { getDeviceType } from "@helpers/index";
import { generateTambolaTicket } from "@utils/index";
import ConfirmationModal from "src/common/modals/ConfirmationModal";
import ResultModal from "src/common/modals/ResultModal";
import StartGameModal from "src/common/modals/StartGameModal";
import "../../styles/GamePage.module.scss";

const COUNTDOWN_TIME = 20;
const MAX_NUMBERS_IN_TICKET = 15;

const items = Array(90)
  .fill("")
  .map((_, index) => index + 1);
const NUMBERS_COUNT = items.length;

const ticketContent = generateTambolaTicket();

const renderReward = (reward, isMobile) => {
  return (
    <div
      key={reward}
      style={{
        color: "#00bfff",
        border: "1px solid #00bfff",
        fontSize: isMobile ? "14px" : "18px",
      }}
      className={`rounded-3 ${isMobile ? "p-1" : "p-2"}`}
    >
      {reward}
    </div>
  );
};

const renderRemainingRewards = (remainingRewards, isMobile = false) => {
  return (
    <div className={isMobile ? "d-flex flex-column align-items-center" : ""}>
      <div
        style={{
          fontSize: isMobile ? "18px" : "1.5rem",
          textDecoration: isMobile ? "underline" : "auto",
        }}
      >
        Remaining Rewards
      </div>
      <div
        className={`mt-2 d-flex container ${isMobile ? "mb-3" : "mb-4"}`}
        style={{
          flexWrap: "wrap",
          gap: "0.5rem",
          padding: 0,
          whiteSpace: "nowrap",
          justifyContent: isMobile ? "space-evenly" : "flex-start",
        }}
      >
        {remainingRewards.map((reward) => (
          <div key={reward}>{renderReward(reward, isMobile)}</div>
        ))}
      </div>
    </div>
  );
};

const GamePage = ({ socket, userName, roomCode }) => {
  const [domLoaded, setDomLoaded] = useState(false);
  const deviceType = getDeviceType();
  const isMobile = deviceType !== "desktop";

  const {
    gameDetails: {
      gameStartedByMe,
      showStartGameModal,
      number,
      numbersAlreadyDone,
      struckOffNumbers,
      resultMessage,
      isFirstTime,
      showConfirmationModal,
      showResultModal,
      remainingRewards,
    },
    actions: {
      setGameStartedByMe,
      setShowStartGameModal,
      setNumber,
      setIsFirstTime,
      setShowConfirmationModal,
      setStruckOffNumbers,
      setSocket,
      setResultMessage,
      setShowResultModal,
      setRemainingRewards,
    },
  } = useGameDetails({
    initialState: gameInitialState,
  });

  const [count, setCount] = useState(0);
  const numberTimerRef = useRef(null);

  useEffect(() => {
    setDomLoaded(true);
    return () => {
      clearInterval(numberTimerRef.current);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("connected");
    });

    socket.on("get_number", (number, numbersAlreadyDone) => {
      setNumber({ number, numbersAlreadyDone, roomCode });
    });

    socket.on("get_remaining_rewards", (remainingRewards) => {
      setRemainingRewards(remainingRewards);
    });

    socket.on("user_started_game", (name) => {
      toast.info(`${name} has started the game`);
    });

    setSocket(socket);

    // Remove event listeners on component unmount
    return () => {
      socket.off("get_number");
      socket.off("get_remaining_rewards");
      socket.off("user_started_game");
    };
  }, [socket]);

  useEffect(() => {
    if (!number && isFirstTime) {
      setShowStartGameModal(true);
      setIsFirstTime(false);
    }
  }, [number, isFirstTime]);

  useEffect(() => {
    if (gameStartedByMe) {
      const newNumber = items[Math.floor(Math.random() * items.length)];
      const newNumberIndex = items.findIndex((item) => item === newNumber);
      items.splice(newNumberIndex, 1);
      setNumber({ number: newNumber, roomCode });
      // Danger: Don't try to mess with the below unless you are 100% sure about what you are doing.
      numberTimerRef.current = setInterval(
        () => setCount((prevCount) => prevCount + 1),
        COUNTDOWN_TIME * 1000
      );
    }
  }, [gameStartedByMe]);

  useEffect(() => {
    if (count > 0) {
      const newNumber = items[Math.floor(Math.random() * items.length)];
      const newNumberIndex = items.findIndex((item) => item === newNumber);
      items.splice(newNumberIndex, 1);
      setNumber({ number: newNumber, roomCode });
      if (count === NUMBERS_COUNT) {
        clearInterval(numberTimerRef.current);
      }
    }
  }, [count]);

  const validateRow = (row) => {
    let count = 0;
    for (let col = 0; col < 9; col++) {
      if (
        numbersAlreadyDone.indexOf(ticketContent[row][col]) > -1 &&
        struckOffNumbers.indexOf(ticketContent[row][col]) > -1
      ) {
        count++;
      }
    }
    return count === 5;
  };

  const validateCorners = () => {
    let count = 0;
    let col = 0;
    while (!Number.isInteger(ticketContent[0][col])) {
      col++;
    }
    if (
      numbersAlreadyDone.indexOf(ticketContent[0][col]) > -1 &&
      struckOffNumbers.indexOf(ticketContent[0][col]) > -1
    ) {
      count++;
    }
    col = 8;
    while (!Number.isInteger(ticketContent[0][col])) {
      col--;
    }
    if (
      numbersAlreadyDone.indexOf(ticketContent[0][col]) > -1 &&
      struckOffNumbers.indexOf(ticketContent[0][col]) > -1
    ) {
      count++;
    }
    col = 0;
    while (!Number.isInteger(ticketContent[2][col])) {
      col++;
    }
    if (
      numbersAlreadyDone.indexOf(ticketContent[2][col]) > -1 &&
      struckOffNumbers.indexOf(ticketContent[2][col]) > -1
    ) {
      count++;
    }
    col = 8;
    while (!Number.isInteger(ticketContent[2][col])) {
      col--;
    }
    if (
      numbersAlreadyDone.indexOf(ticketContent[2][col]) > -1 &&
      struckOffNumbers.indexOf(ticketContent[2][col]) > -1
    ) {
      count++;
    }
    return count === 4;
  };

  const validateTicket = () => {
    if (struckOffNumbers.indexOf(number) === -1) {
      setResultMessage({ resultMessage: "Boogie", roomCode });
      return;
    }

    // Quick Five
    let selectedNumbers = [];
    if (remainingRewards.indexOf("Quick Five") > -1) {
      selectedNumbers = numbersAlreadyDone.filter((number) =>
        struckOffNumbers.includes(number)
      );
      if (selectedNumbers.length === 5) {
        setResultMessage({ resultMessage: "Quick Five", roomCode });
        return;
      }
    }

    // Corners
    if (remainingRewards.indexOf("Corners") > -1 && validateCorners()) {
      setResultMessage({ resultMessage: "Corners", roomCode });
      return;
    }

    // First Row
    if (remainingRewards.indexOf("First Row") > -1 && validateRow(0)) {
      setResultMessage({ resultMessage: "First Row", roomCode });
      return;
    }

    // Second Row
    if (remainingRewards.indexOf("Second Row") > -1 && validateRow(1)) {
      setResultMessage({ resultMessage: "Second Row", roomCode });
      return;
    }

    // Third Row
    if (remainingRewards.indexOf("Third Row") > -1 && validateRow(2)) {
      setResultMessage({ resultMessage: "Third Row", roomCode });
      return;
    }

    // Full houses
    if (
      remainingRewards.indexOf("First Fullhouse") > -1 ||
      remainingRewards.indexOf("Second Fullhouse") > -1
    ) {
      selectedNumbers = numbersAlreadyDone.filter((number) =>
        struckOffNumbers.includes(number)
      );
      if (selectedNumbers.length === MAX_NUMBERS_IN_TICKET) {
        if (remainingRewards.indexOf("First Fullhouse") > -1) {
          setResultMessage({ resultMessage: "First Fullhouse", roomCode });
        } else if (remainingRewards.indexOf("Second Fullhouse") > -1) {
          setResultMessage({ resultMessage: "Second Fullhouse", roomCode });
        }
        return;
      }
    }

    setResultMessage({ resultMessage: "Boogie", roomCode });
  };

  const strikeOff = (ticketContent, row, column) => {
    if (Number.isInteger(ticketContent[row][column])) {
      if (struckOffNumbers.indexOf(ticketContent[row][column]) === -1) {
        setStruckOffNumbers([...struckOffNumbers, ticketContent[row][column]]);
      } else {
        setStruckOffNumbers(
          struckOffNumbers.filter((num) => num !== ticketContent[row][column])
        );
      }
    }
  };

  const renderTicket = () => {
    const size = isMobile ? "35px" : "50px";
    return (
      <table
        style={{
          border: "0.5px solid black !important",
          width: "fit-content",
          marginBottom: isMobile ? "0.5rem" : "1rem",
        }}
        className="table"
      >
        <tbody>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <tr className="d-flex" style={{ height: size }} key={i}>
                {Array(9)
                  .fill(0)
                  .map((_, j) => (
                    <td
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: size,
                        cursor: "pointer",
                        fontWeight: "bolder",
                        backgroundColor:
                          struckOffNumbers.indexOf(ticketContent[i][j]) > -1
                            ? "#66ccff"
                            : "#FFFFEF",
                        border: "0.5px solid gray",
                        fontFamily: "Rubik, sans-serif",
                      }}
                      key={i * 10 + j}
                      onClick={() => strikeOff(ticketContent, i, j)}
                    >
                      {ticketContent[i][j]}
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  const disableClaimBtn =
    resultMessage ||
    !remainingRewards.length ||
    !items.length ||
    items.length === numbersAlreadyDone.length;

  if (isMobile) {
    return (
      <>
        {domLoaded && (
          <>
            <div className="d-flex flex-column align-items-center">
              <h1
                className="px-3 pt-2"
                style={{
                  width: "fit-content",
                  color: "#660066",
                  fontFamily: "cursive",
                }}
              >
                Tambola
              </h1>
              <div className="d-flex flex-column align-items-center">
                <div
                  className="d-flex align-items-center"
                  style={{ fontSize: "18px" }}
                >
                  <div className="me-1">The Number is</div>
                  <div
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black",
                      width: "30px",
                      height: "30px",
                      textAlign: "center",
                      alignItems: "center",
                      fontFamily: "Rubik, sans-serif",
                    }}
                  >
                    {number || 90}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  {`Next number in ${COUNTDOWN_TIME} second${
                    COUNTDOWN_TIME === 1 ? "" : "s"
                  }`}
                </div>
              </div>
              <div className="d-flex flex-column align-items-center mt-5">
                <div>{renderTicket()}</div>
                <button
                  style={{
                    width: "fit-content",
                    cursor: disableClaimBtn ? "auto" : "pointer",
                    fontSize: "16px",
                  }}
                  className={`${
                    disableClaimBtn ? "bg-secondary" : "bg-primary"
                  } text-white rounded-2 py-1 px-2 mt-1`}
                  onClick={() => setShowConfirmationModal(true)}
                  disabled={disableClaimBtn}
                >
                  {!remainingRewards.length ||
                  !items.length ||
                  items.length === numbersAlreadyDone.length
                    ? "Game Over"
                    : "Claim"}
                </button>
              </div>
              <div
                className="d-flex flex-column align-items-center mt-5"
                style={{
                  border: "1px solid gray",
                  borderRadius: "4px",
                  width: "80%",
                  padding: "0.5rem 1rem 0",
                }}
              >
                {renderRemainingRewards(remainingRewards, true)}
              </div>
              <RoomAndUsers socket={socket} isMobile={true} />
            </div>
            <StartGameModal
              isOpen={showStartGameModal}
              onClose={() => setShowStartGameModal(false)}
              onProceed={() => {
                socket.emit("game_started", { name: userName, room: roomCode });
                setGameStartedByMe(true);
              }}
            />
            <ConfirmationModal
              isOpen={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onProceed={() => {
                validateTicket();
                setShowConfirmationModal(false);
              }}
            />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            {resultMessage.length > 0 && resultMessage !== "Boogie" && (
              <Confetti numberOfPieces={500} />
            )}
            <ResultModal
              {...{
                isOpen: showResultModal,
                onProceed: () => setShowResultModal(false),
                message: resultMessage,
              }}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {domLoaded && (
        <>
          <h1
            className="px-3 pt-2"
            style={{
              width: "fit-content",
              color: "#660066",
              fontFamily: "cursive",
            }}
          >
            Tambola
          </h1>
          <div className="d-flex m-3">
            <div style={{ width: "67%" }} className="me-3">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="d-flex align-items-center"
                  style={{ fontSize: "2rem" }}
                >
                  <div className="me-2">The Number is</div>
                  <div
                    style={{
                      borderRadius: "50%",
                      border: "2px solid black",
                      width: "3.2rem",
                      height: "3.2rem",
                      textAlign: "center",
                      alignItems: "center",
                      fontFamily: "Rubik, sans-serif",
                    }}
                  >
                    {number}
                  </div>
                </div>
                <div>
                  {`Next number in ${COUNTDOWN_TIME} second${
                    COUNTDOWN_TIME === 1 ? "" : "s"
                  }`}
                </div>
              </div>
              <div className="d-flex flex-column align-items-center mt-5">
                <div>{renderTicket()}</div>
                <button
                  style={{
                    width: "fit-content",
                    cursor: disableClaimBtn ? "auto" : "pointer",
                    fontSize: "20px",
                  }}
                  className={`${
                    disableClaimBtn ? "bg-secondary" : "bg-primary"
                  } text-white rounded-2 py-1 px-2 mt-1`}
                  onClick={() => setShowConfirmationModal(true)}
                  disabled={disableClaimBtn}
                >
                  {!remainingRewards.length ||
                  !items.length ||
                  items.length === numbersAlreadyDone.length
                    ? "Game Over"
                    : "Claim"}
                </button>
              </div>
            </div>
            <div style={{ width: "33%" }}>
              <div>{renderRemainingRewards(remainingRewards)}</div>
              <RoomAndUsers socket={socket} />
            </div>
          </div>
          <StartGameModal
            isOpen={showStartGameModal}
            onClose={() => setShowStartGameModal(false)}
            onProceed={() => {
              socket.emit("game_started", { name: userName, room: roomCode });
              setGameStartedByMe(true);
            }}
          />
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onProceed={() => {
              validateTicket();
              setShowConfirmationModal(false);
            }}
          />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {resultMessage.length > 0 && resultMessage !== "Boogie" && (
            <Confetti numberOfPieces={500} />
          )}
          <ResultModal
            {...{
              isOpen: showResultModal,
              onProceed: () => setShowResultModal(false),
              message: resultMessage,
            }}
          />
        </>
      )}
    </>
  );
};

GamePage.propTypes = {
  location: PropTypes.any,
};

export default GamePage;
