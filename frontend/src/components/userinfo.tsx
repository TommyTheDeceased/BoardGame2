import React from "react";

export default function SideBar(props: any) {
  return (
    <div className="sidebar">
      <div className="playerinfo">
        <ul className="userul">
          {props.users.map(
            (user: {
              name: "Player 1" | "Player 2" | "Player 3" | "Player 4";
            }) => (
              <li className="userli" key={user.name} id={user.name}>
                <h3
                  className={
                    user.name === props.currentUser ? "myname" : "username"
                  }
                >
                  {user.name === props.currentUser
                    ? `${user.name}: You`
                    : `${user.name}`}
                </h3>
                <h3
                  className={
                    props.playerHealth[user.name] >= 50
                      ? "GreenHealth"
                      : "RedHealth"
                  }
                >
                  {props.playerHealth[user.name].toString()} Hp
                </h3>
                <h3 className="PlayerPosition">
                  Tile: {props.playerPositions[user.name]}
                </h3>
                <h3 className="PlayerCash">$ {props.playerCash[user.name]}</h3>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
