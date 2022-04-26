import React from "react";
import Avatar from "src/designSystem/Avatar/Index";

function DesignSystemScreen() {
  const avatarProps = {
    text: "Bro Zoro",
    size: 80,
    showSingleLetter: true,
  };
  return (
    <div>
      <Avatar {...avatarProps} />
    </div>
  );
}

export default DesignSystemScreen;
