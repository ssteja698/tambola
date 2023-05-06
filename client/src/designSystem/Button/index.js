import React from "react";
import PropTypes from "prop-types";

const colors = {
  primary: "#533e85",
  secondary: "#488fb1",
  danger: "#d9534f",
  warning: "#f0ad4e",
  info: "#5bc0de",
};
function Button({ text, type, outlined, handleClick, ...props }) {
  return (
    <>
      <button className="button" onClick={handleClick}>
        {text}
      </button>
      <style jsx>{`
        .button {
          background-color: ${outlined ? "#fff" : type ? colors[type] : "#fff"};
          color: ${type === "warning" || !type || outlined
            ? "#363636"
            : "#fff"};
          cursor: pointer;
          justify-content: center;
          padding-bottom: calc(0.5rem - 1px);
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: calc(0.5rem - 1px);
          text-align: center;
          white-space: nowrap;
          border-radius: 5px;
          margin: 0.1rem;
          border: 1px solid ${(type && colors[type]) || "aliceblue"};
        }
        .button:hover {
          border: 1px solid ${(type && colors[type]) || "#dbdbdb"};
        }
      `}</style>
    </>
  );
}

Button.propTypes = {
  text: PropTypes.string,
  handleClick: PropTypes.func,
  type: PropTypes.string,
  outlined: PropTypes.bool,
};

export default Button;
