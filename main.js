
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

var suitsToChars = {"spades": "S", "diamonds": "D", "clubs": "C", "hearts": "H"};
var valuesToNumbers = {"A": 11, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
"8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10};

var LIMIT = 21;


function beforeGame() 
{
    setBalance(100);
}

function setBalance(balance)
{
    document.getElementById("balance").innerText = "Balance: " + balance;
}

function setAmount(user, amount) 
{
    id = "totalPlayer";
    if (user == "Dealer") {
        id = "totalDealer";
    }
    document.getElementById(id).innerText = user + " total: " + amount;
}


function changeHand(user, index, card) {
    if (index < 1 || index > 7) {
        console.log("bad");
    }
    var u = "p";
    if (user == "Dealer"){
        u = "d"
    }
    document.getElementById(u + index).innerText = card[Suit] + "\n" + card[Value]; // is it OK?
    setAmount(user, valuesToNumbers[card[Value]]);
}







function getDeck()
{
    var deck = new Array();

    for(var i = 0; i < suits.length; i++)
    {
        for(var x = 0; x < values.length; x++)
        {
            var card = {Value: values[x], Suit: suits[i]};
            deck.push(card);
        }
    }

    return deck;
}

function shuffle(deck)
{
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

function renderDeck(deck)
{
    document.getElementById('deck').innerHTML = '';

    for(var i = 0; i < deck.length; i++)
    {
        var card = document.createElement("div");
        var icon = '';
        if (deck[i].Suit == 'hearts')
        icon='?';
        else if (deck[i].Suit == 'spades')
        icon = '?';
        else if (deck[i].Suit == 'diamonds')
        icon = '?';
        else
        icon = '?';

        card.innerHTML = deck[i].Value + '' + icon;
        card.className = 'card';
    document.getElementById("deck").appendChild(card);
    }
}

var index = 0;
var countAces = 0;
var PlayerCount = 0;
var DealerCount = 0;

function hit(deck, user, amount)
//opens the top card of the deck
{
    if (deck.length <= 0){
        console.log("empty deck");
    }
    index++;
    var card = deck.pop();
    changeHand(user, index, card);
    if (card[Value] == "A"){
        countAces++;
    }
    amount = amount + valuesToNumbers[card[Value]] //is it OK?

    return checkLimit(amount);
}

function checkLimit(amount){
    while (amount > LIMIT){
        if (countAces == 0){
            return 0;
        }
        //wait 1 second
        countAces--;

    }
}

function playerDecision()
//TODO ask the user to "hit" or to "stand" and returns it
{

}

function changeAmount(user, amount, adding)
{
    var ret = amount + adding;
    setAmount(user, ret);
    return ret;
}

function userTurn(deck, user)
{
    var openedCards = new Array();
    var countAces = 0;
    var amount = 0;

    amount = hit(deck, user, amount);

    amount = hit(deck, user, amount);

    if (user == "Player"){
        var continuePlay = playerDecision();
        while (continuePlay != "stand" || inGame == 1){
            card = hit(deck, user);
            openedCards.push(card);
            count = count + valuesToNumbers[card[Value]] //is it OK?
        }
    }

    else if (user == "Dealer"){
        while (inGame == 1){
            card = hit(deck, user);
            openedCards.push(card);
            count = count + valuesToNumbers[card[Value]] //is it OK?
        }
    }
}

function clean()
{
    //TODO clean: index, all the cards, countAces, 
}

function endGame()
{

}

function singleGame()
{
    //TODO get the amount of betting money of the user

    var deck = getDeck();
    deck = shuffle(deck);
    var succeed = userTurn(deck, "Player");
    if (succeed == 0){
        endGame();
    }
}

function gameDuration()
{

}

