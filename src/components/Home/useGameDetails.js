import PropTypes from "prop-types";
import { useReducer } from "react";

const ACTIONS = {
  SET_NUMBER: "setNumber",
  SET_IS_FIRST_TIME: "setIsFirstTime",
  SET_GAME_STARTED_BY_ME: "setGameStartedByMe",
  SET_SHOW_START_GAME_MODAL: "setShowStartGameModal",
  SET_SHOW_CONFIRMATION_MODAL: "setShowConfirmationModal",
  SET_SHOW_USERNAME_MODAL: "setShowUserNameModal",
  SET_STRUCKOFF_NUMBERS: "setStruckOffNumbers",
  SET_SOCKET: "setSocket",
  SET_RESULT_MESSAGE: "setResultMessage",
  SET_REMAINING_REWARDS: "setRemainingRewards",
  SET_SHOW_RESULT_MODAL: "setShowResultModal",
};

export const gameInitialState = {
  gameStartedByMe: false,
  showStartGameModal: false,
  number: "",
  numbersAlreadyDone: [],
  struckOffNumbers: [],
  socket: null,
  users: [],
  resultMessage: "",
  isFirstTime: true,
  showConfirmationModal: false,
  showUserNameModal: true,
  showResultModal: false,
  remainingRewards: [
    "Quick Five",
    "Corners",
    "First Row",
    "Second Row",
    "Third Row",
    "First Fullhouse",
    "Second Fullhouse",
  ],
};

const gameDetailsReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET_NUMBER: {
      if (state.gameStartedByMe && payload.number) {
        state.socket?.emit("set-number", payload.number);
      }
      return {
        ...state,
        number: payload.number,
        numbersAlreadyDone: payload.numbersAlreadyDone
          ? payload.numbersAlreadyDone
          : payload.number
          ? [...state.numbersAlreadyDone, payload.number]
          : state.numbersAlreadyDone,
        showStartGameModal: false,
      };
    }
    case ACTIONS.SET_GAME_STARTED_BY_ME: {
      return {
        ...state,
        gameStartedByMe: payload,
        showStartGameModal: false,
      };
    }
    case ACTIONS.SET_SHOW_START_GAME_MODAL: {
      return {
        ...state,
        showStartGameModal: payload,
      };
    }
    case ACTIONS.SET_IS_FIRST_TIME: {
      return {
        ...state,
        isFirstTime: payload,
      };
    }
    case ACTIONS.SET_SHOW_CONFIRMATION_MODAL: {
      return {
        ...state,
        showConfirmationModal: payload,
      };
    }
    case ACTIONS.SET_SHOW_USERNAME_MODAL: {
      return {
        ...state,
        showUserNameModal: payload,
      };
    }
    case ACTIONS.SET_STRUCKOFF_NUMBERS: {
      return {
        ...state,
        struckOffNumbers: payload,
      };
    }
    case ACTIONS.SET_SOCKET: {
      return {
        ...state,
        socket: payload,
      };
    }
    case ACTIONS.SET_RESULT_MESSAGE: {
      state.socket?.emit("update-users-with-new-result", payload);
      if (payload !== "Boogie") {
        state.socket?.emit("set-remaining-rewards", payload);
      }
      return {
        ...state,
        resultMessage: payload,
        showResultModal: true,
        remainingRewards:
          payload === "Boogie"
            ? state.remainingRewards
            : state.remainingRewards.filter((reward) => reward !== payload),
      };
    }
    case ACTIONS.SET_REMAINING_REWARDS: {
      return {
        ...state,
        remainingRewards: payload,
      };
    }
    case ACTIONS.SET_SHOW_RESULT_MODAL: {
      return {
        ...state,
        showResultModal: payload,
      };
    }
    default:
      return state;
  }
};

const useGameDetails = ({ initialState }) => {
  const [gameDetails, dispatch] = useReducer(gameDetailsReducer, {
    ...initialState,
  });

  function setGameStartedByMe(gameStartedByMe) {
    dispatch({
      type: ACTIONS.SET_GAME_STARTED_BY_ME,
      payload: gameStartedByMe,
    });
  }

  function setShowStartGameModal(showStartGameModal) {
    dispatch({
      type: ACTIONS.SET_SHOW_START_GAME_MODAL,
      payload: showStartGameModal,
    });
  }

  function setNumber(number, numbersAlreadyDone) {
    dispatch({
      type: ACTIONS.SET_NUMBER,
      payload: { number, numbersAlreadyDone },
    });
  }

  function setIsFirstTime(isFirstTime) {
    dispatch({
      type: ACTIONS.SET_IS_FIRST_TIME,
      payload: isFirstTime,
    });
  }

  function setShowConfirmationModal(showConfirmationModal) {
    dispatch({
      type: ACTIONS.SET_SHOW_CONFIRMATION_MODAL,
      payload: showConfirmationModal,
    });
  }

  function setShowUserNameModal(showUserNameModal) {
    dispatch({
      type: ACTIONS.SET_SHOW_USERNAME_MODAL,
      payload: showUserNameModal,
    });
  }

  function setStruckOffNumbers(struckOffNumbers) {
    dispatch({
      type: ACTIONS.SET_STRUCKOFF_NUMBERS,
      payload: struckOffNumbers,
    });
  }

  function setSocket(socket) {
    dispatch({
      type: ACTIONS.SET_SOCKET,
      payload: socket,
    });
  }

  function setResultMessage(resultMessage) {
    dispatch({
      type: ACTIONS.SET_RESULT_MESSAGE,
      payload: resultMessage,
    });
  }

  function setRemainingRewards(remainingRewards) {
    dispatch({
      type: ACTIONS.SET_REMAINING_REWARDS,
      payload: remainingRewards,
    });
  }

  function setShowResultModal(showResultModal) {
    dispatch({
      type: ACTIONS.SET_SHOW_RESULT_MODAL,
      payload: showResultModal,
    });
  }

  return {
    gameDetails,
    actions: {
      setShowStartGameModal,
      setGameStartedByMe,
      setNumber,
      setIsFirstTime,
      setShowConfirmationModal,
      setShowUserNameModal,
      setStruckOffNumbers,
      setSocket,
      setResultMessage,
      setRemainingRewards,
      setShowResultModal,
    },
  };
};

useGameDetails.propTypes = {
  initialState: PropTypes.object,
};

export default useGameDetails;
