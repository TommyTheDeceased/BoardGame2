import React from "react"


function GenerateRandomCard() {
    var cards = ["no card","cash card:", "community card","damage card:"];

    return cards[Math.floor(Math.random() * cards.length)];
}


export function GenSquares(playerPosition: number,setSquareData: React.Dispatch<any>) {
    var squares: any = {};
    for(var i = 0; i < playerPosition; i++) {
        var card = GenerateRandomCard();
        var randamt = 0;

        if(card === "cash card:") {
            randamt = Math.floor(Math.random() * 100) + 1;
            card = card + randamt.toString();

            squares[i] = card;
        }
        if(card === "damage card:") {
            randamt = Math.floor(Math.random() * 10) + 1;
            card = card + randamt.toString();

            squares[i] = card
        }
        if(card === "no card") {
            squares[i] = card
        }
        if(card === "community card") {
            squares[i] = card
        }
    }
    console.log(squares)

    return squares
}