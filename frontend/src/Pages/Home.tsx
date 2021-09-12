import React, { useState } from "react";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { Socket } from "socket.io-client";
import FunctionHandler from "../utils/functions";
import { History } from "history";

type HomeProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  functions: FunctionHandler;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  roomid: string;
  history: History;
};

export default function HomePage({
  setRoomId,
  socket,
  functions,
  roomid,
  history,
}: HomeProps) {
  const [pageroomid, setpageid] = useState("");

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.toString().trim() === "") setRoomId("");
    setpageid(`${event.target.value}`);
  };
  const handleJoin = (event: React.FormEvent<HTMLFormElement>) => {
    setRoomId(pageroomid);
    history.push("/play");
  };

  return (
    <div>
      <form onSubmit={(e) => handleJoin(e)}>
        <input
          placeholder="Room Id"
          onChange={(event) => handleValue(event)}
          value={pageroomid}
        />
        <button type="submit">Join/Create Room</button>
      </form>
    </div>
  );
}
