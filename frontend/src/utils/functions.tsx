import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { History } from "history";

export default class FunctionHandler {
  constructor(
    private socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    private window: Window & typeof globalThis
  ) {}

  handleLeave(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isInGame: boolean,
    setRoom: React.Dispatch<React.SetStateAction<string>>,
    history: History
  ) {
    setRoom("");
    this.socket.emit("disconnect_me");
    history.push("/home");
  }

  handleMove(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tileid: number,
    currentUser: "Player 1" | "Player 2" | "Player 3" | "Player 4" | "",
    turn: "Player 1" | "Player 2" | "Player 3" | "Player 4",
    playerPositons: {
      "Player 1": number;
      "Player 2": number;
      "Player 3": number;
      "Player 4": number;
    },
    users: any[],
    gameOver: boolean,
    playerDecks: {
      "Player 1": any[];
      "Player 2": any[];
      "Player 3": any[];
      "Player 4": any[];
    },
    playerHealth: {
      "Player 1": number;
      "Player 2": number;
      "Player 3": number;
      "Player 4": number;
    },
    playerCash: {
      "Player 1": number;
      "Player 2": number;
      "Player 3": number;
      "Player 4": number;
    },
    winner: string
  ) {
    var newturn;
    if (currentUser === turn) {
      playerPositons[turn] = tileid;
      const playernum = turn.split(" ")[1];
      if (parseInt(playernum) >= users.length) {
        newturn = "Player 1";
      } else {
        newturn = `Player ${parseInt(playernum) + 1}`;
      }

      this.socket.emit("updateGameState", {
        gameOver,
        turn: newturn,
        playerDecks,
        playerHealth,
        playerCash,
        playerPositons,
        winner,
      });
    }
  }

  handleCardUsage(
    cardid: any,
    playerDecks: {
      "Player 1": any[];
      "Player 2": any[];
      "Player 3": any[];
      "Player 4": any[];
    },
    currentUser: "Player 1" | "Player 2" | "Player 3" | "Player 4" | ""
  ) {
    if (currentUser === "") return;
    const usersdeck = playerDecks[currentUser];

    const hascard = usersdeck.find((card) => card.id === cardid);
    if (hascard) {
      return true;
    } else {
      return false;
    }
  }

  handleJoin(event: React.FormEvent<HTMLFormElement>, roomid: string) {
    event.preventDefault();
    this.window.location.href = `/play`;
  }
}
