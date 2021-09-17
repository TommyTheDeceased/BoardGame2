import React from "react";
import { GenSquares } from "../utils/squares";

const handleRoll = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  socket: any,
  turn: any,
  currentUser: any,
  roomid: any,
  setLastRolled: any,
  playerPositions: any,
  users: any[],
  gameOver: any,
  playerHealth: any,
  playerCash: any,
  winner: any,
  squaredata: any,
  setSquareData: React.Dispatch<any>
) => {
  event.preventDefault();
  if (turn === currentUser) {
    if (playerHealth[turn] > 0) {
      var randomnumber = 0;
      randomnumber = Math.floor(Math.random() * 6) + 1;
      socket.emit("updateRollNum", {
        room: roomid,
        number: randomnumber.toString(),
      });
      setLastRolled(randomnumber.toString());
      var newturn: any;
      playerPositions[turn] += randomnumber;
      const squares = GenSquares(
        Math.floor(playerPositions[turn] + randomnumber),
        setSquareData
      );
      if (squares[playerPositions[turn]].includes("damage card:")) {
        var dmg = parseInt(squares[playerPositions[turn]].split(":")[1]);
        if (dmg) {
          if (playerHealth[turn] - dmg <= 0) {
            playerHealth[turn] = 0;
          } else {
            playerHealth[turn] -= dmg;
          }
        }
      }
      if (squares[playerPositions[turn]].includes("cash card:")) {
        var amt = parseInt(squares[playerPositions[turn]].split(":")[1]);
        if (amt) {
          if (amt > 0) {
            playerCash[turn] += amt;
          }
        }
      }
      if (squares[playerPositions[turn]].includes("community card")) {
        for (var [key] of Object.entries(playerHealth)) {
          var random = Math.floor(Math.random() * 2) + 1;
          var randomamt = Math.floor(Math.random() * 20) + 1;
          if (random === 2) {
            if (playerHealth[key] - randomamt > 0) {
              playerHealth[key] -= randomamt;
            } else {
              playerHealth[key] = 0;
            }
          } else if (random === 1) {
            playerHealth[key] += randomamt;
          }
        }
        for (var [key2] of Object.entries(playerCash)) {
          var random2 = Math.floor(Math.random() * 2) + 1;
          var randomamt2 = Math.floor(Math.random() * 20) + 1;
          if (random2 === 2) {
            playerCash[key2] -= randomamt2;
          } else if (random2 === 1) {
            playerCash[key2] += randomamt2;
          }
        }
      }
      socket.emit("updateGameState", {
        chosenCard: squares[playerPositions[turn]],
      });
      const playernum = turn.split(" ")[1];
      if (parseInt(playernum) >= users.length) {
        newturn = "Player 1";
      } else {
        newturn = `Player ${parseInt(playernum) + 1}`;
      }

      socket.emit("updateGameState", {
        gameOver,
        turn: newturn,
        oldturn: turn,
        playerHealth,
        playerCash,
        playerPositions,
        winner,
        rolled: randomnumber.toString(),
        chosenCard: squares[playerPositions[turn]],
      });

      setTimeout(() => {
        socket.emit(
          "updateGameState",
          {
            gameOver,
            turn: newturn,
            oldturn: turn,
            playerHealth,
            playerCash,
            playerPositions,
            winner,
            rolled: "Roll",
            chosenCard: "",
          },
          1750
        );
      }, 2000);
    } else {
      var newturn2: any;
      const playernum = turn.split(" ")[1];
      if (parseInt(playernum) >= users.length) {
        newturn2 = "Player 1";
      } else {
        newturn2 = `Player ${parseInt(playernum) + 1}`;
      }

      socket.emit("updateGameState", {
        gameOver,
        turn: newturn2,
        oldturn: turn,
        playerHealth,
        playerCash,
        playerPositions,
        winner,
        rolled: "Roll",
        chosenCard: "",
      });
    }
  }
};

const prices: any = {
  "buyHP:20": 120,
  "buyHP:50": 420,
};

const checkifbuyable = (playerCash: any, turn: any, BuyAble_Id: any) => {
  return Math.floor(playerCash[turn] - prices[BuyAble_Id]) >= 0 ? true : false;
};

const handleBuyAbles = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  socket: any,
  turn: any,
  currentUser: any,
  playerCash: any,
  playerHealth: any,
  BuyAble_Id: any
) => {
  event.preventDefault();
  if (turn === currentUser) {
    if (playerHealth[turn] > 0) {
      switch (BuyAble_Id.toString()) {
        case "buyHP:20":
          if (checkifbuyable(playerCash, turn, BuyAble_Id) === true) {
            playerHealth[turn] += 20;
            playerCash[turn] -= prices[BuyAble_Id];
            return true;
          } else {
            return false;
          }
        case "buyHP:50":
          if (checkifbuyable(playerCash, turn, BuyAble_Id) === true) {
            playerCash[turn] -= prices[BuyAble_Id];
            playerHealth[turn] += 50;
            return true;
          } else {
            return false;
          }
      }
    }
  }
};

export { handleRoll };
