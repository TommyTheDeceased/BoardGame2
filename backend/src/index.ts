import Application from "./classes/Application";
import UserResources from "./classes/UserResources";
import Utils from "./classes/Utils";

const instance: {
  users: UserResources;
  utils: Utils;
  app: Application;
} = {
  users: new UserResources(),
  utils: new Utils(),
  app: new Application(3001),
};

instance.app.io.on("connection", (socket) => {
  socket.on("AnnounceWinner", (payload) => {
    if (payload.winnerName.trim() !== "") {
      instance.app.io
        .to(payload.room)
        .emit("AnnounceWinner", { winnerName: payload.winnerName });
    }
  });
  socket.emit("updateRollNum", (payload: any) => {
    instance.app.io.to(payload.room).emit("updateRollNum", {
      room: payload.room,
      number: payload.randomnumber,
    });
  });
  socket.on("join", (payload, callback) => {
    if (payload.room.trim() === "")
      return callback({ error: "please provide a room id" });
    let numberofusersinroom = instance.users.getUsersInRoom(
      payload.room
    ).length;

    let name = instance.users.findMissingName(payload.room);
    if (name === undefined) return callback({ error: "game is full" });

    const { error, newUser, room2 } = instance.users.addUser({
      id: socket.id,
      name: name,
      room: payload.room,
    });

    if (error) return callback(error);
    if (!newUser) return callback({ error: "new user not generated" });
    if (!room2) return callback({ Error: "room data not loaded" });

    socket.join(payload.room);

    instance.app.io.to(payload.room).emit("roomData", {
      room: newUser.room,
      users: instance.users.getUsersInRoom(newUser.room),
      roomdata: room2,
    });
    socket.emit("currentUserData", { name: newUser.name });
    callback();
    instance.app.io.to(payload.room).emit("getCurrentGameData", room2);
  });

  socket.on("initGameState", (gameState, roomid) => {
    const user = instance.users.getUser(socket.id);
    if (user) {
      var room2 = instance.users.roomdatas.find(
        (room) => room.room === user.room
      );
      if (!room2) {
        instance.users.roomdatas.push({
          room: user.room,
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
          users: [user.name],
          gameOver: false,
          turn: "Player 1",
          rolled: "Roll",
          winner: "",
          winnerEnabled: false,
          full: [user.name].length === 4 ? true : false,
          currentServerMessage: "",
        });
      }
      room2 = instance.users.roomdatas.find((room) => room.room === user.room);
      instance.app.io.to(user.room).emit("initGameState", { ...room2 });
    }
  });

  socket.on("updateGameState", (gameState) => {
    const user = instance.users.getUser(socket.id);
    var room2 = instance.users.roomdatas.find(
      (room) => room.room === user.room
    );
    for (var [key, value] of Object.entries(gameState)) {
      room2[key] = value;
    }
    if (user)
      instance.app.io.to(user.room).emit("updateGameState", { ...room2 });
  });

  socket.on("sendMessage", (payload, callback) => {
    const user = instance.users.getUser(socket.id);
    instance.app.io
      .to(user.room)
      .emit("message", { user: user.name, text: payload.message });
    callback();
  });

  socket.on("disconnect_me", () => {
    const user = instance.users.removeUser(socket.id);
    if (user) {
      var room2 = instance.users.roomdatas.find(
        (room) => room.room === user.room
      );
      if (!room2) {
        instance.users.roomdatas.push({
          room: user.room,
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
          users: [user.name],
          gameOver: false,
          turn: "Player 1",
          rolled: "Roll",
          winner: "",
          winnerEnabled: false,
          full: [user.name].length === 4 ? true : false,
          currentServerMessage: "",
        });
      } else {
        if (Math.floor(room2.users.length - 1) <= 0) {
          var index = instance.users.roomdatas.findIndex(
            (room) => room.room === room2.room
          );
          if (index !== -1) {
            return instance.users.roomdatas.splice(index, 1)[0];
          }
        } else {
          var userindex = room2.users.findIndex(
            (user2: any) => user2 === user.name
          );
          if (userindex !== -1) {
            room2.users.splice(userindex, 1);
          }
          room2.playerCash[user.name] = 0;
          room2.playerPositions[user.name] = 0;
          room2.playerHealth[user.name] = 100;
        }
      }
      instance.app.io.to(user.room).emit("roomData", {
        room: user.room,
        users: instance.users.getUsersInRoom(user.room),
        roomdata: room2,
      });
    }
  });
  socket.on("disconnect", () => {
    const user = instance.users.removeUser(socket.id);
    if (user) {
      var room2 = instance.users.roomdatas.find(
        (room) => room.room === user.room
      );
      if (!room2) {
        instance.users.roomdatas.push({
          room: user.room,
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
          users: [user.name],
          gameOver: false,
          turn: "Player 1",
          rolled: "Roll",
          winner: "",
          winnerEnabled: false,
          full: [user.name].length === 4 ? true : false,
          currentServerMessage: "",
        });
      } else {
        if (Math.floor(room2.users.length - 1) <= 0) {
          var index = instance.users.roomdatas.findIndex(
            (room) => room.room === room2.room
          );
          if (index !== -1) {
            return instance.users.roomdatas.splice(index, 1)[0];
          }
        } else {
          room2.playerCash[user.name] = 0;
          room2.playerPositions[user.name] = 0;
          room2.playerHealth[user.name] = 100;
        }
      }
      instance.app.io.to(user.room).emit("roomData", {
        room: user.room,
        users: instance.users.getUsersInRoom(user.room),
        roomdata: room2,
      });
    }
  });
});
