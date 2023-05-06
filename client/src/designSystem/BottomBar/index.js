import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

const BottomBar = ({ title = "", content = "", showContent = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBar = () => {
    if (showContent) {
      setIsOpen(!isOpen);
    }
  };

  const closeBar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="bottom-bar-container">
        <button className="bottom-bar-toggle w-100" onClick={toggleBar}>
          {title || "Toggle Bar"}
        </button>
      </div>
      <div
        className={`bottom-bar-overlay ${isOpen ? "open" : ""}`}
        onClick={closeBar}
      ></div>
      <div className={`bottom-bar-content ${isOpen ? "open" : ""}`}>
        <div className="bottom-bar-close" onClick={closeBar}>
          <IoIosCloseCircle size={20} />
        </div>
        <div className="bottom-bar-content-inner">{content}</div>
      </div>
    </>
  );
};

export default BottomBar;
