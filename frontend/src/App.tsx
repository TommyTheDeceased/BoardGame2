import React, { useState } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import SocketManager from "./utils/socket";
import Game from "./Pages/game";
import FunctionHandler from "./utils/functions";
import HomePage from "./Pages/Home";
import { useHistory } from "react-router";

let socket = new SocketManager().socket;
let functions = new FunctionHandler(socket, window);

function App() {
  const [roomid, setRoomId] = useState<string>("");
  const history = useHistory();

  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <Switch>
        <Route
          path="/play"
          exact={true}
          component={() => (
            <Game
              socket={socket}
              roomid={`${roomid}`}
              functions={functions}
              history={history}
            />
          )}
        />
        <Route
          path="/home"
          exact={true}
          component={() => (
            <HomePage
              socket={socket}
              roomid={roomid}
              setRoomId={setRoomId}
              functions={functions}
              history={history}
            />
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
