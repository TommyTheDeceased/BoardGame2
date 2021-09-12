import React from "react";

export default function BoardSquare(props: any) {
  return (
    <button className="boardsquare">
      <img src={props.tileImage} alt={`${props.tileNumber}BoardSquare`} />
    </button>
  );
}
