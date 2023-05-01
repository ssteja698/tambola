import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const ConfirmationModal = ({ isOpen, afterOpenModal, onClose, onProceed }) => {
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={onClose}
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
      <div style={{ fontSize: "1.5rem" }}>Are you sure to claim?</div>
      <div>Wrong claim will result in a boogie</div>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onProceed}>
          Yes, proceed
        </button>
      </div>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  afterOpenModal: PropTypes.func,
  onClose: PropTypes.func,
  onProceed: PropTypes.func,
};

ConfirmationModal.defaultProps = {
  afterOpenModal: () => {},
  onClose: () => {},
  onProceed: () => {},
};

export default ConfirmationModal;
