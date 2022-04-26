import React from "react";
import Avatar from "src/designSystem/Avatar/Index";
import Button from "src/designSystem/Button";

function DesignSystemScreen() {
  const avatarProps = {
    text: "Bro Zoro",
    size: 80,
    showSingleLetter: true,
  };
  return (
    <>
      <Avatar {...avatarProps} />
      <Button {...avatarProps} />
    </>
  );
}

export default DesignSystemScreen;
