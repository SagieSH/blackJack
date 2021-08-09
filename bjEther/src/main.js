
// let suits = ["spades", "diamonds", "clubs", "hearts"];
let suits = ["\u2660", "\u2662", "\u2667", "\u2665"];
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let valuesToNumbers = {"A": 11, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
"8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10};

let userToIndex = {"Player": 0, "Dealer": 1};

let deck = new Array();
let playerTurn = false;     // indicates whether the player can hit or stand
let inGame = false;         // indicates whether the player is currently in game
let BUSTLIMIT = 22;
let DEALLIMIT = 17;

let indexInTable;
let amount;
let countAces;
let balance;


function beforeGame() {
    indexInTable = [1, 1];
    amount = [0, 0];
    countAces = [0, 0];
    let search = location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    if (isNaN(Number(params["Balance"])) || Number(params["Balance"]) <= 0) {
        window.location.replace("start.html");
        alert("Deposit amount must be a positive integer!");
    }
    document.getElementById("msg").innerText = "Press \'New Game\' to start!";

    document.getElementById("DealerMsg").innerText = "Dealer Hand:";
    document.getElementById("PlayerMsg").innerText = "Player (" + params["Player"] + ") Hand:";
    setBalance(Number(params["Balance"]));
    console.log(params["Address"]);
}


function setBalance(newBalance) {
    balance = newBalance;
    document.getElementById("balance").innerText = "Balance: " + newBalance;
}


function setAmount(user, newAmount) {
    amount[userToIndex[user]] = newAmount;
    let id = "total" + user;
    document.getElementById(id).innerText = user + " total: " + newAmount;
}


function addAmount(user, adding) {
    ret = amount[userToIndex[user]] + adding;
    setAmount(user, ret);
}


function placeCard(user, card) {
    // place the card in the index of the user's table
    index = indexInTable[userToIndex[user]];
    if (index < 1 || index > 7) {
        console.log("bad");
    }
    let u = "p";
    if (user == "Dealer") {
        u = "d"
    }
    document.getElementById(u + index).innerText = card["value"] + card["suit"];
    addAmount(user, valuesToNumbers[card["value"]]);
    indexInTable[userToIndex[user]]++;
}


function getDeck() {

    for(let i = 0; i < suits.length; i++)
    {
        for(let x = 0; x < values.length; x++)
        {
            let card = {"value": values[x], "suit": suits[i]};
            deck.push(card);
        }
    }
}


function shuffle() {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 1000; i++)
    {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}


function checkIfPlayerTurn() {
    if (!playerTurn) {
        if (!inGame) {
            alert("Press \'New Game\' to start!");
        } else {
            alert("It is not your turn!");
        }
        return false;
    }
    return true;
}


function hitHTML() {
    if (!checkIfPlayerTurn()) {
        return;
    }
    if (hitJS("Player")) {
        document.getElementById("msg").innerText = "Player bust. DEALER WINS!";
        dealerWin();
        endGame();
    }
}


function hitJS(user) {
//opens the top card of the deck
    if (deck.length <= 0){
        console.log("empty deck");
    }
    let card = deck.pop();
    placeCard(user, card);
    if (card["value"] == "A") {
        countAces[userToIndex[user]]++;
    }

    return isAbove(user, BUSTLIMIT, false);

}


function standHTML() {
    if (!checkIfPlayerTurn()) {
        return;
    }
    playerTurn = false;
    document.getElementById("msg").innerText = "Now wait for the dealer to finish...";
    runDealer();
    endGame();
}


function runDealer() {
    while (!isAbove("Dealer", DEALLIMIT, true)) {
        hitJS("Dealer");
    }

    if (isAbove("Dealer", BUSTLIMIT, false)) {
        document.getElementById("msg").innerText = "Dealer bust. PLAYER WINS!";
        playerWin();
        return;
    }
    playerAmount = amount[userToIndex["Player"]];
    dealerAmount = amount[userToIndex["Dealer"]];

    if (playerAmount == dealerAmount) {
        document.getElementById("msg").innerText = "It's a tie!";
        return;
    }

    if (playerAmount > dealerAmount) {
        document.getElementById("msg").innerText = "PLAYER WINS!";
        playerWin();
        return;
    }

    document.getElementById("msg").innerText = "DEALER WINS!";
    dealerWin();
}


function isAbove(user, limit, deal) {
    // returns whether we have passed the limit
    
    while (amount[userToIndex[user]] >= limit) {
        if (countAces[userToIndex[user]] == 0 || deal) {
            return true;
        }
        //wait 1 second
        countAces[userToIndex[user]]--;
        addAmount(user, -10);

    }


    return false;
}


function playerWin(){
    //TODO updates the balances of the players
    setBalance(balance + 1);
}


function dealerWin(){
    //TODO updates the balances of the players
    setBalance(balance - 1);
}


// function sleep(milliseconds) {
//   let start = new Date().getTime();
//   for (let i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds) {
//       break;
//     }
//   }
// }


// function userTurn(deck, user) {
//     let countAces = 0;
//     // let amount = 0;

//     amount = hitJS(user, amount);
//     amount = hitJS(user, amount);

//     if (user == "Player") {
//         let continuePlay = playerDecision();
//         while (continuePlay != "stand" || inGameVar == 1){
//             card = hitJS(user);
//             openedCards.push(card);
//             count = count + valuesToNumbers[card["value"]];
//         }
//     }

//     else if (user == "Dealer") {
//         while (inGameVar == 1) {
//             card = hitJS(user);
//             openedCards.push(card);
//             count = count + valuesToNumbers[card["value"]];
//         }
//     }
// }


function cleanTable() {
    // clean: all the cards
    for (let i = 1; i < indexInTable[userToIndex["Player"]]; i++){
        document.getElementById("p" + i).innerText = "";
    }
    for (let i = 1; i < indexInTable[userToIndex["Dealer"]]; i++){
        document.getElementById("d" + i).innerText = "";
    }

    document.getElementById("msg").innerText = "Press \'New Game\' to start again!";
}


function endGame() {
    playerTurn = false;
    inGame = false;
    // document.getElementById("msg").innerText = "Game is over";
}


function gameSetup() {
    indexInTable = [1, 1];
    amount = [0, 0];
    countAces = [0, 0];
    setAmount("Player", 0);
    setAmount("Dealer", 0);
    hitJS("Dealer");
    hitJS("Player");
    hitJS("Player");
    document.getElementById("msg").innerText = "You may HIT or STAND";
}


function singleGame() {
    //TODO get the amount of betting money of the user
    if (balance <= 0) {
        alert("Not enough balance!");
        return;
    }
    getDeck();
    shuffle();
    cleanTable();
    gameSetup();
    inGame = true;
    playerTurn = true;
}

