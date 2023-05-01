import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const ResultModal = ({ isOpen, onProceed, message }) => {
  return (
    <Modal
      isOpen={isOpen}
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onProceed();
          }
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
          }}
        >
          {message === "Boogie"
            ? "Sorry, your claim is a boogie"
            : `Congratulations, you win ${message}`}
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-primary" onClick={() => onProceed()}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

ResultModal.propTypes = {
  isOpen: PropTypes.bool,
  onProceed: PropTypes.func,
  message: PropTypes.string,
};

ResultModal.defaultProps = {
  onProceed: () => {},
  message: "",
};

export default ResultModal;
