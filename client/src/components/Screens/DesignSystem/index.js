import React from "react";
import Button from "@designSystem/Button";
import Card from "@designSystem/Card";
import s from "./index.module.scss";

function DesignSystemScreen() {
  const handleButtonClick = () => {
    alert("Button clicked!");
  };
  return (
    <div className={s.designSystemContainer}>
      <Card title={"Button"}>
        <Button
          primary
          handleClick={handleButtonClick}
          text={"click me!!"}
          type={"primary"}
          outlined
        />
      </Card>
      <Card title={"card"}>
        <Card title={"This is Title"} width={200}>
          this is content!!
        </Card>
      </Card>
    </div>
  );
}

export default DesignSystemScreen;
