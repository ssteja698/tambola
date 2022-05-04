import React from "react";
import Avatar from "@designSystem/Avatar";
import Button from "@designSystem/Button";
import Card from "@designSystem/Card";
import s from "./index.module.scss";

function DesignSystemScreen() {
  const avatarProps = {
    text: "Bro Zoro",
    size: 80,
    showSingleLetter: true,
  };
  const handleButtonClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className={s.designSystemContainer}>
      <Card title={"Avatar"}>
        <Avatar {...avatarProps} />
      </Card>
      <Card title={"Button"}>
        <Button
          primary
          handleClick={handleButtonClick}
          text={"click me!!"}
          type={"primary"}
          outlined
        />
      </Card>
      <Card title={"card"} width={200}>
        <Card title={"This is Title"} width={200}>
          this is content!!
        </Card>
      </Card>
    </div>
  );
}

export default DesignSystemScreen;
