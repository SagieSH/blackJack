
var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

var valuesToNumbers = {"A": 11, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7
"8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10};

var LIMIT = 21;

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

function openTop(deck)
//opens the top card of the deck
//TODO add visual effect
{
    if (deck.length <= 0){
        //print that the deck is empty
        return //what to return?
    }
    return deck.pop();
}

function checkLimit(count){

}

function userDecision()
//TODO ask the user to "hit" or to "stand"
{

}

function userTurn(deck)
{
    var openedCards = new Array();
    var count = 0;
    var card = openTop(deck);
    openedCards.push(card);
    card = openTop(deck);
    openedCards.push(card);
    var continuePlay = "hit";
    while (continuePlay != "stand"){
        card = openTop(deck);
        openedCards.push(card);
        count = count + valuesToNumbers(card[Value]) //is it OK?

    }
}

function singleGame()
{
    //TODO get the amount of betting money of the user

    var deck = getDeck();
    deck = shuffle(deck);
    var under
    userTurn

}

function gameDuration()
{

}
