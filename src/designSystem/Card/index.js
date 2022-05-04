import React from "react";
import PropTypes from "prop-types";

const shadows = {
  min: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
  med: "box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;",
  max: "box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
};
function Card({ title, children, height, width, shadow, ...props }) {
  return (
    <div className="card">
      {title && <div className="title">{title}</div>}
      <div className="content">{children}</div>
      <style jsx>{`
        .title {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #e6e6e6;
        }
        .card {
          height: ${height || "100px"}px;
          width: ${width || "200px"}px;
          max-width: 100%;
          border-radius: 5px;
          margin: 0.5rem 0;
          box-shadow: ${(shadow && shadow[shadow]) || shadows.min};
        }
        .content {
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  shadow: PropTypes.string,
};

export default Card;
