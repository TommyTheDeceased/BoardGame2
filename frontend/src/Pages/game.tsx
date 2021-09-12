import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import FunctionHandler from "../utils/functions";
import Header from "../components/header";
import SideBar from "../components/userinfo";
import { History } from "history";
import "./game.css";

type GameProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  roomid: string;
  functions: FunctionHandler;
  history: History;
};

export default function Game({
  socket,
  roomid,
  functions,
  history,
}: GameProps) {
  const [room, setRoom] = useState<string>(roomid);
  const [full, setFull] = useState<boolean>(false);
  const [lastRolled, setLastRolled] = useState("Roll");
  const [winnerEnabled, setWinnerEnabled] = useState(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [turn, setTurn] = useState<
    "Player 1" | "Player 2" | "Player 3" | "Player 4"
  >("Player 1");
  const [winner, setWinner] = useState<string>("");
  const [users, setUsers] = useState<Array<any>>([]);
  const [currentUser, setCurrentUser] = useState<
    "Player 1" | "Player 2" | "Player 3" | "Player 4" | ""
  >("");

  const [playerHealth, setPlayerHealth] = useState<{
    "Player 1": number;
    "Player 2": number;
    "Player 3": number;
    "Player 4": number;
  }>({
    "Player 1": 100,
    "Player 2": 100,
    "Player 3": 100,
    "Player 4": 100,
  });
  const [playerCash, setPlayerCash] = useState<{
    "Player 1": number;
    "Player 2": number;
    "Player 3": number;
    "Player 4": number;
  }>({
    "Player 1": 0,
    "Player 2": 0,
    "Player 3": 0,
    "Player 4": 0,
  });
  const [playerPositions, setPlayerPosition] = useState<{
    "Player 1": number;
    "Player 2": number;
    "Player 3": number;
    "Player 4": number;
  }>({
    "Player 1": 0,
    "Player 2": 0,
    "Player 3": 0,
    "Player 4": 0,
  });

  //server messages

  const [currentServerMessage, setCurrentServerMessage] = useState("");

  useEffect(() => {
    socket.emit("join", { room: room }, (error: any) => {
      console.log(error);
      if (error === "room data not loaded") {
        socket.emit("initGameState", {
          gameOver: false,
          turn: "Player 1",
          playerHealth: {
            "Player 1": 100,
            "Player 2": 100,
            "Player 3": 100,
            "Player 4": 100,
          },
          playerCash: {
            "Player 1": 0,
            "Player 2": 0,
            "Player 3": 0,
            "Player 4": 0,
          },
          playerPositions: {
            "Player 1": 0,
            "Player 2": 0,
            "Player 3": 0,
            "Player 4": 0,
          },
          rolled: "Roll",
          users: ["Player 1"],
        });
      }
      if (error) {
        setFull(true);
        setCurrentServerMessage("Game Full");
      }
    });

    socket.on(
      "initGameState",
      ({
        playerHealth,
        playerCash,
        playerPositions,
        users,
        gameOver,
        turn,
        winner,
        winnerEnabled,
        full,
        currentServerMessage,
        rolled,
      }) => {
        console.log("init");
        setPlayerHealth(playerHealth);
        setPlayerCash(playerCash);
        setPlayerPosition(playerPositions);
        setUsers(users);
        setGameOver(gameOver);
        setTurn(turn);
        setWinner(winner);
        setWinnerEnabled(winnerEnabled);
        setFull(full);
        setCurrentServerMessage(currentServerMessage);
        setLastRolled(rolled || "Roll");
      }
    );

    socket.on("roomData", ({ users, roomdata }) => {
      console.log(roomdata);
      setUsers(users);
      setPlayerHealth(roomdata.playerHealth);
      setPlayerCash(roomdata.playerCash);
      setPlayerPosition(roomdata.playerPositions);
      setGameOver(roomdata.gameOver);
      setTurn(roomdata.turn);
      setWinner(roomdata.winner);
      setWinnerEnabled(roomdata.winnerEnabled);
      setFull(roomdata.full);
      setCurrentServerMessage(roomdata.currentServerMessage);
      setLastRolled(roomdata.rolled || "Roll");
    });
    socket.on("currentUserData", ({ name }) => {
      setCurrentUser(name);
    });

    return function cleanup() {
      socket.emit("disconnect_me");
      socket.off();
    };
  }, [socket, room]);

  useEffect(() => {
    socket.on("updateRollNum", ({ room, number }) => {
      console.log(number);
      setLastRolled(number);
    });

    socket.on(
      "updateGameState",
      ({
        gameOver,
        turn,
        playerHealth,
        playerCash,
        playerPositions,
        winner,
        rolled,
      }) => {
        var amount_cant_play: any[] = [];
        for (var [key, value] of Object.entries(playerHealth)) {
          if (key === "Player 1" && typeof value === "number" && value <= 0) {
            amount_cant_play.push(key);
            if (key === turn) {
              var nextkey = "Player 1";

              var currentnumber = key.split(" ")[1];
              if (parseInt(currentnumber) >= users.length) {
                if (amount_cant_play.includes(nextkey)) nextkey = "Player 2";
                if (amount_cant_play.includes(nextkey)) nextkey = "Player 3";
                if (amount_cant_play.includes(nextkey)) nextkey = "Player 4";
              } else {
                if (amount_cant_play.includes(nextkey))
                  nextkey = `Player ${currentnumber}`;
              }
            }
          }
        }
        if (amount_cant_play.length >= 3) {
          var winning;
          if (
            playerHealth["Player 1"] === 0 &&
            playerHealth["Player 2"] === 0 &&
            playerHealth["Player 3"] === 0
          ) {
            winning = "Player 4";
          } else if (
            playerHealth["Player 4"] === 0 &&
            playerHealth["Player 3"] === 0 &&
            playerHealth["Player 2"] === 0
          ) {
            winning = "Player 1";
          } else if (
            playerHealth["Player 1"] === 0 &&
            playerHealth["Player 3"] === 0 &&
            playerHealth["Player 4"] === 0
          ) {
            winning = "Player 2";
          } else if (
            playerHealth["Player 2"] === 0 &&
            playerHealth["Player 1"] === 0 &&
            playerHealth["Player 4"] === 0
          ) {
            winning = "Player 3";
          }
          if (winning) {
            socket.emit("AnnounceWinner", {
              winnerName: winning,
              room: roomid,
            });
          }
        }
        setLastRolled(rolled);
        setWinner(winner);
        setGameOver(gameOver);
        setTurn(turn);
        setPlayerHealth(playerHealth);
        setPlayerCash(playerCash);
        setPlayerPosition(playerPositions);
        setLastRolled(rolled);
      }
    );

    socket.on("AnnounceWinner", ({ winnerName }) => {
      if (winnerName.trim() !== "") {
        setWinnerEnabled(true);
        setGameOver(true);
      } else {
        setWinnerEnabled(false);
        setGameOver(true);
      }
    });
  }, [socket, room, roomid, users]);

  const handleRoll = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (turn === currentUser) {
      var randomnumber = 0;
      let interval = setInterval(() => {
        randomnumber = Math.floor(Math.random() * 6) + 1;
        socket.emit("updateRollNum", {
          room: roomid,
          number: randomnumber.toString(),
        });
      }, 500);
      setTimeout(() => {
        clearInterval(interval);
        setLastRolled(randomnumber.toString());
        var newturn: any;
        playerPositions[turn] += randomnumber;
        const playernum = turn.split(" ")[1];
        if (parseInt(playernum) >= users.length) {
          newturn = "Player 1";
        } else {
          newturn = `Player ${parseInt(playernum) + 1}`;
        }

        socket.emit("updateGameState", {
          gameOver,
          turn: newturn,
          playerHealth,
          playerCash,
          playerPositions,
          winner,
          rolled: randomnumber.toString(),
        });

        setTimeout(() => {
          socket.emit("updateGameState", {
            gameOver,
            turn: newturn,
            playerHealth,
            playerCash,
            playerPositions,
            winner,
            rolled: "Roll",
          });
        }, 1750);
      }, 2000);
    }
  };

  if (full === false) {
    return (
      <div className="container">
        <Header room={room} users={users} />
        <SideBar
          playerCash={playerCash}
          playerPositions={playerPositions}
          playerHealth={playerHealth}
          currentUser={currentUser}
          users={users}
        />
        <div className="Center">
          <div className="Board">
            <button className="dice-roll" onClick={(e) => handleRoll(e)}>
              {lastRolled === "Roll" ? "Roll" : `Last Roll: ${lastRolled}`}
            </button>
          </div>
          <h1
            className="WinnerH1"
            style={{
              visibility: winnerEnabled && gameOver ? "visible" : "hidden",
            }}
          >
            WINNER: {winner}
          </h1>
        </div>
      </div>
    );
  } else {
    return (
      <div className="Container">
        <h1>Game is full</h1>
        <button
          className="Leave-full-btn"
          onClick={(e) => functions.handleLeave(e, false, setRoom, history)}
        >
          Leave!
        </button>
      </div>
    );
  }
}
