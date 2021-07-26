
var suits = ["spades", "diamonds", "clubs", "hearts"];
// var suits = ["♠", "♦", "♣", "♥"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var valuesToNumbers = {"A": 11, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
"8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10};

var userToIndex = {"Player": 0, "Dealer": 1};

var deck = new Array();
var playerTurn = false;     // indicates whether the player can hit or stand
var inGame = false;         // indicates whether the player is currently in game
var BUSTLIMIT = 22;
var DEALLIMIT = 17;

var indexInTable = [0, 0];
var amount = [0, 0];
var countAces = 0;


function beforeGame() {
    setBalance(100);
    document.getElementById("msg").innerText = "Please start a new game"
}


function setBalance(balance) {
    document.getElementById("balance").innerText = "Balance: " + balance;
}


function setAmount(user, newAmount) {
    amount[userToIndex[user]] = newAmount;
    var id = "total" + user;
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
    var u = "p";
    if (user == "Dealer") {
        u = "d"
    }
    document.getElementById(u + index).innerText = card["suit"] + "\n" + card["value"];
    addAmount(user, valuesToNumbers[card["value"]]);
    indexInTable[userToIndex[user]]++;
}


function getDeck() {

    for(var i = 0; i < suits.length; i++)
    {
        for(var x = 0; x < values.length; x++)
        {
            var card = {"value": values[x], "suit": suits[i]};
            deck.push(card);
        }
    }
}


function shuffle() {
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++)
    {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

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
        endGame();
    }
}


function hitJS(user) {
//opens the top card of the deck
    if (deck.length <= 0){
        console.log("empty deck");
    }
    var card = deck.pop();
    placeCard(user, card);
    if (card["value"] == "A") {
        countAces++;
    }

    return isAbove(user, BUSTLIMIT);

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


function playerWin(){
    //TODO updates the balances of the players
}


function dealerWin(){
    //TODO updates the balances of the players
}


function runDealer() {
    while (!isAbove("Dealer", DEALLIMIT)) {
        hitJS("Dealer");
    }

    if (isAbove("Dealer", BUSTLIMIT)) {
        document.getElementById("msg").innerText = "Dealer bust. PLAYER WINS!";
        //playerWin();
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
        //playerWin();
        return;
    }

    document.getElementById("msg").innerText = "DEALER WINS!";
    //dealerWin();
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function isAbove(user, limit) {
    // returns whether we have passed the limit

    // while (amount > LIMIT){
    //     if (countAces == 0) {
    //         return 0;
    //     }
    //     //wait 1 second
    //     countAces--;

    // }


    return (amount[userToIndex[user]] >= limit);
}


function userTurn(deck, user) {
    var countAces = 0;
    // var amount = 0;

    amount = hitJS(user, amount);
    amount = hitJS(user, amount);

    if (user == "Player"){
        var continuePlay = playerDecision();
        while (continuePlay != "stand" || inGameVar == 1){
            card = hitJS(user);
            openedCards.push(card);
            count = count + valuesToNumbers[card["value"]] //is it OK?
        }
    }

    else if (user == "Dealer"){
        while (inGameVar == 1){
            card = hitJS(user);
            openedCards.push(card);
            count = count + valuesToNumbers[card["value"]] //is it OK?
        }
    }
}


function cleanTable() {
    // clean: all the cards
    for (var i = 1; i < indexInTable[userToIndex["Player"]]; i++){
        document.getElementById("p" + i).innerText = "";
    }
    for (var i = 1; i < indexInTable[userToIndex["Dealer"]]; i++){
        document.getElementById("d" + i).innerText = "";
    }
    
    document.getElementById("msg").innerText = "Press \'New Game\' to start again!";
}


function endGame() {
    playerTurn = false;
    inGame = false;
    document.getElementById("msg").innerText = "Game is over";
    cleanTable();
}


function gameSetup() {
    indexInTable = [1, 1];
    amount = [0, 0];
    hitJS("Dealer");
    hitJS("Player");
    hitJS("Player");
    document.getElementById("msg").innerText = "You may HIT or STAND"
}


function singleGame() {
    //TODO get the amount of betting money of the user

    getDeck();
    shuffle();
    cleanTable();
    gameSetup();
    inGame = true;
    playerTurn = true;
}

