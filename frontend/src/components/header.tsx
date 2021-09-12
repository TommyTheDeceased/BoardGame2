import React from "react";

export default function Header(props: any) {
  return (
    <div className="topInfo">
      <h1>Game Code: {props.room}</h1>
      <h1>Players: {props.users.length}/4</h1>
    </div>
  );
}
