import React from "react";

export default function ServerMessage(props: any) {
  return (
    <div className="servermessage">
      <h1>{props.currentServerMessage}</h1>
    </div>
  );
}
