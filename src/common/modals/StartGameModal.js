import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const StartGameModal = ({ isOpen, afterOpenModal, onProceed }) => {
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid #000",
        },
      }}
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 200, width: 300 }}
      >
        <button
          className="btn btn-primary"
          style={{ height: 50 }}
          onClick={() => onProceed()}
        >
          Start The Game
        </button>
      </div>
    </Modal>
  );
};

StartGameModal.propTypes = {
  isOpen: PropTypes.bool,
  afterOpenModal: PropTypes.func,
  onProceed: PropTypes.func,
};

StartGameModal.defaultProps = {
  afterOpenModal: () => {},
  onProceed: () => {},
};

export default StartGameModal;
