import BottomBar from "@designSystem/BottomBar";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const userDetails = ({ name, resultMessage }) => {
  return (
    <div
      key={name}
      className={`border border-secondary p-2 rounded-3 mb-2 ${
        resultMessage.length > 0
          ? resultMessage === "Boogie"
            ? "text-danger"
            : "text-success"
          : ""
      }`}
    >
      <div style={{ fontSize: "1.5rem" }}>{name}</div>
      {resultMessage.length > 0 && (
        <div className="mt-1">
          {resultMessage !== "Boogie" && "Won "}
          {resultMessage}
        </div>
      )}
    </div>
  );
};

const renderUserList = (users) => {
  return (
    <div
      style={{
        maxHeight: "calc(95vh - 200px)",
        overflowY: "scroll",
      }}
      className="border border-secondary"
    >
      <div
        style={{
          backgroundColor: "#E8E8E8",
        }}
        className="position-sticky top-0 mb-2 px-3 py-2"
      >
        Other Participants{" "}
        <span style={{ fontWeight: "normal" }}>({users?.length})</span>
      </div>
      <div className="px-3">{users?.map((user) => userDetails(user))}</div>
    </div>
  );
};

const RoomAndUsers = ({ socket, isMobile }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("get-users", (users) => {
      setUsers(users);
    });

    return () => socket.off("get-users");
  }, [socket]);

  useEffect(() => {
    socket.on("set-users-with-new-result", (user) => {
      setUsers((users) => {
        const filteredUsers = users.filter((u) => u.id !== user.id);
        return [user, ...filteredUsers];
      });
      if (user.resultMessage === "Boogie") {
        toast.info(`${user.name}'s claim is a Boogie`);
      } else {
        toast.info(`${user.name} won ${user.resultMessage}`);
      }
    });

    return () => socket.off("set-users-with-new-result");
  }, [socket]);

  useEffect(() => {
    socket.on("user-connected", (newUser) => {
      setUsers((users) => [...users, newUser]);
      toast.info(`${newUser?.name} joined the game`);
    });

    return () => socket.off("user-connected");
  }, [socket]);

  useEffect(() => {
    socket.on("user-disconnected", (oldUser) => {
      setUsers((users) => users.filter((user) => user.id !== oldUser?.id));
      toast.info(`${oldUser?.name} left the game`);
    });

    return () => socket.off("user-disconnected");
  }, [socket]);

  if (isMobile) {
    return (
      <BottomBar
        title={
          <div className="position-sticky top-0 mb-2 px-3 py-2">
            Other Participants{" "}
            <span style={{ fontWeight: "normal" }}>({users?.length})</span>
          </div>
        }
        content={
          <div className="px-3">{users?.map((user) => userDetails(user))}</div>
        }
        showContent={users.length > 0}
      />
    );
  }

  return <div>{renderUserList(users)}</div>;
};

export default RoomAndUsers;
