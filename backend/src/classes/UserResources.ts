export default class UserResources {
  public users: any = [];
  public usernamesforrooms: { roomid: string; username: string; id: any }[] =
    [];
  public roomdatas: any[] = [];

  addUser({ id, name, room }: { id: any; name: any; room: any }) {
    var maxusers = 4;
    const numberofusersinroom = this.users.filter(
      (user: any) => user.room === room
    ).length;
    if (numberofusersinroom === maxusers) return { error: "Room Full" };

    const newUser = { id, name, room };
    this.users.push(newUser);
    this.usernamesforrooms.push({ roomid: room, username: name, id: id });
    var room2 = this.roomdatas.find((room2) => room2.room === room);
    if (room2) {
      room2.users.push(name);
      room2.playerHealth[name] = 100;
    } else {
      this.roomdatas.push({
        room: room,
        playerHealth: {
          "Player 1": 100,
          "Player 2": 0,
          "Player 3": 0,
          "Player 4": 0,
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
        users: [name],
        gameOver: false,
        turn: "Player 1",
        rolled: "Roll",
        winner: "",
        winnerEnabled: false,
        full: [name].length === 4 ? true : false,
        currentServerMessage: "",
      });
    }
    room2 = this.roomdatas.find((room2) => room2.room === room);
    return { newUser, room2 };
  }

  removeUser(id: any) {
    const removeIndex = this.users.findIndex((user: any) => user.id === id);
    const removeNameIndex = this.usernamesforrooms.findIndex(
      (user) => user.id === id
    );
    if (removeNameIndex !== -1)
      this.usernamesforrooms.splice(removeNameIndex, 1);
    if (removeIndex !== -1) return this.users.splice(removeIndex, 1)[0];
  }

  findMissingName(roomid: string) {
    const usernames = this.usernamesforrooms.filter(
      (user) => user.roomid === roomid
    );
    var taken_Names: string[] = [];
    if (usernames) {
      for (var name of usernames) {
        taken_Names.push(name.username);
      }
      if (taken_Names.length > 0) {
        for (var takenname of taken_Names) {
          var index = parseInt(takenname.split(" ")[1]) + 1;
          if (index >= 5) {
            index = 1;
          }
          const nextname = `Player ${index}`;
          if (!taken_Names.includes(nextname)) {
            return nextname;
          }
        }
      } else {
        return "Player 1";
      }
    } else {
      return "Player 1";
    }
  }

  getUser(id: any) {
    return this.users.find((user: any) => user.id === id);
  }

  getUsersInRoom(room: any) {
    return this.users.filter((user: any) => user.room === room);
  }
}
