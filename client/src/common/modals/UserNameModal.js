import React, { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const UserNameModal = ({ isOpen, afterOpenModal, onClose, onProceed }) => {
  const [userName, setUserName] = useState("");

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
      <div style={{ fontSize: "1.5rem" }}>Please provide your name</div>
      <input
        className="mt-2 w-100"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-primary" onClick={() => onProceed(userName)}>
          Proceed
        </button>
      </div>
    </Modal>
  );
};

UserNameModal.propTypes = {
  isOpen: PropTypes.bool,
  afterOpenModal: PropTypes.func,
  onClose: PropTypes.func,
  onProceed: PropTypes.func,
};

UserNameModal.defaultProps = {
  afterOpenModal: () => {},
  onClose: () => {},
  onProceed: () => {},
};

export default UserNameModal;
