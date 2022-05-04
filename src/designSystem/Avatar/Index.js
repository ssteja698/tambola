import React from "react";
import PropTypes from "prop-types";

function Avatar({
  text,
  size = 50,
  color = "009688",
  showSingleLetter = false,
}) {
  return (
    <div className="avatar">
      {showSingleLetter
        ? text?.split(" ")[0][0] || "J"
        : `${text?.split(" ")[0][0] || "J"} ${text?.split(" ")[1][0] || "B"}`}
      <style jsx>{`
        .avatar {
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: #${color};
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: ${size / 2.7}px;
          color: #fff;
          position: relative !important;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}

Avatar.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  showSingleLetter: PropTypes.bool,
};

export default Avatar;
