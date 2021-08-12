pragma solidity ^0.5.0;

import "./BJToken.sol";

contract BJTokenGame {
    address admin;
    BJToken public tokenContract;
    uint256 public tokenPrice;

    event Sell(address _buyer, uint256 _amount);
    event BalanceOf(address _account, uint256 _amount);

    constructor (BJToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        initMaps();
        initDeck();
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value > 0);
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        
        tokenContract.addTokens(msg.sender, _numberOfTokens);

        emit BalanceOf(msg.sender, tokenContract.balanceOf(msg.sender));
    }

    function withdraw(uint256 _numberOfTokens) public {
        require(_numberOfTokens > 0);
        require(tokenContract.balanceOf(msg.sender) >= _numberOfTokens);

        msg.sender.transfer(_numberOfTokens * tokenPrice);

        tokenContract.deductTokens(msg.sender, _numberOfTokens);

        emit BalanceOf(msg.sender, tokenContract.balanceOf(msg.sender));
    }


    //-------------------------------- Game Logic ----------------------------------------------

    function random() private view returns (uint) {
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)));
        // convert hash to integer
        // players is an array of entrants
        
    }

    event Alert(string _msg);
    event SetAmount(string _user, uint _newAmount);
    event ChangeHTMLText(string _id, string _newText);
    event PlaceCard(string _user, uint _index, string _suit, string _value);

    string[4] suits = ["\u2660", "\u2662", "\u2667", "\u2665"];
    string[13] values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    mapping(string => uint) valuesToNumbers;
    mapping(string => uint) userToIndex;

    function initMaps() private {

        valuesToNumbers["A"] = 11;
        valuesToNumbers["2"] = 2;
        valuesToNumbers["3"] = 3;
        valuesToNumbers["4"] = 4;
        valuesToNumbers["5"] = 5;
        valuesToNumbers["6"] = 6;
        valuesToNumbers["7"] = 7;
        valuesToNumbers["8"] = 8;
        valuesToNumbers["9"] = 9;
        valuesToNumbers["10"] = 10;
        valuesToNumbers["J"] = 10;
        valuesToNumbers["Q"] = 10;
        valuesToNumbers["K"] = 10;

        userToIndex["Player"] = 0;
        userToIndex["Dealer"] = 1;
    }

    struct Card {
        string value;
        string suit;
    }

    Card[52] deck;

    bool playerTurn = false;        // indicates whether the player can hit or stand
    bool inGame = false;            // indicates whether the player is currently in game
    uint BUSTLIMIT = 22;
    uint DEALLIMIT = 17;

    uint[2] indexInTable;
    uint[2] amount;
    uint[2] countAces;

    uint indexInDeck;

    function initDeck() private {
        uint index = 0;

        for(uint i = 0; i < suits.length; i++) {
            for(uint j = 0; j < values.length; j++) {
                card = Card(values[i], suits[j]);
                deck[index] = card;
                index++;
            }
        }
        indexInDeck = 0;
    }

    function setAmount(user, newAmount) private {
        amount[userToIndex[user]] = newAmount;
        emit SetAmount(user, newAmount);
    }

    function addAmount(user, adding) private {
        uint ret = amount[userToIndex[user]] + adding;
        setAmount(user, ret);
    }

    function popDeck() private returns (Card) {
        indexInDeck++;
        return deck[indexInDeck - 1];
    }
    
    function placeCard(string user, Card card) private {
        uint index = indexInTable[userToIndex[user]];
        emit PlaceCard(user, index, card.suit, card.value)
        addAmount(user, valuesToNumbers[card.value]);
        indexInTable[userToIndex[user]]++;
    }


    function shuffle() private {
        for (uint i = 0; i < 1000; i++) {
            Card location1 = random() % deck.length;
            Card location2 = random() % deck.length;
            Card tmp = deck[location1];

            deck[location1] = deck[location2];
            deck[location2] = tmp;
        }
    }

    function checkIfPlayerTurn() public returns(bool) {
        if (!playerTurn) {
            if (!inGame) {
                emit Alert("Press \'New Game\' to start!");
            } else {
                emit Alert("It is not your turn!");
            }
            return false;
        }
        return true;
    }

    function hitHTML() public {
        if (!checkIfPlayerTurn()) {
            return;
        }
        if (hitJS("Player")) {
            emit ChangeHTMLText("msg", "Player bust. DEALER WINS!");
            dealerWin();
            endGame();
        }
    }

    function hitJS(user) private returns (bool) {
        //opens the top card of the deck
        if (indexInDeck >= deck.length) {
            emit Alert("empty deck");
            return false;
        }
        Card card = popDeck();
        placeCard(user, card);
        if (card["value"] == "A") {
            countAces[userToIndex[user]]++;
        }

        return isAbove(user, BUSTLIMIT, false);

    }

    function standHTML() public {
        if (!checkIfPlayerTurn()) {
            return;
        }
        playerTurn = false;
        emit ChangeHTMLText("msg", "Now wait for the dealer to finish...");
        runDealer();
        endGame();
    }

    function runDealer() private {
        while (!isAbove("Dealer", DEALLIMIT, true)) {
            hitJS("Dealer");
        }

        if (isAbove("Dealer", BUSTLIMIT, false)) {
            emit ChangeHTMLText("msg", "Dealer bust. PLAYER WINS!");
            playerWin();
            return;
        }

        uint playerAmount = amount[userToIndex["Player"]];
        uint dealerAmount = amount[userToIndex["Dealer"]];

        if (playerAmount == dealerAmount) {
            emit ChangeHTMLText("msg", "It's a tie!");
            return;
        }

        if (playerAmount > dealerAmount) {
            emit ChangeHTMLText("msg", "PLAYER WINS!");
            playerWin();
            return;
        }

        emit ChangeHTMLText("msg", "DEALER WINS!");
        dealerWin();
    }

    function isAbove(string user, uint limit, bool deal) private returns(bool) {
        // returns whether we have passed the limit
        
        while (amount[userToIndex[user]] >= limit) {
            if ((countAces[userToIndex[user]] == 0) || deal) {
                return true;
            }
            //wait 1 second
            countAces[userToIndex[user]]--;
            addAmount(user, -10);

        }
        
        return false;
    }   

    function playerWin() private {
        tokenContract.addTokens(msg.sender, 1);
        emit BalanceOf(msg.sender, tokenContract.balanceOf(msg.sender));
    }


    function dealerWin() private {
        tokenContract.deductTokens(msg.sender, 1);
        emit BalanceOf(msg.sender, tokenContract.balanceOf(msg.sender));
    }

    function cleanTable() private {
        // clean: all the cards
        for (let i = 1; i < indexInTable[userToIndex["Player"]]; i++) {
            emit PlaceCard("p", i, "remove", "");
        }
        for (let i = 1; i < indexInTable[userToIndex["Dealer"]]; i++){
            emit PlaceCard("d", i, "remove", "");
        }

        emit ChangeHTMLText("msg", "Press \'New Game\' to start again!");
    }

    function endGame() private {
        playerTurn = false;
        inGame = false;
    }

    function gameSetup() private {
        indexInTable = [1, 1];
        amount = [0, 0];
        countAces = [0, 0];
        setAmount("Player", 0);
        setAmount("Dealer", 0);
        hitJS("Dealer");
        hitJS("Player");
        hitJS("Player");
        emit ChangeHTMLText("msg", "You may HIT or STAND");
    }

    function singleGame() public {
        if (balanceOf(msg.sender) <= 0) {
            emit Alert("Not enough balance!");
            return;
        }
        shuffle();
        cleanTable();
        gameSetup();
        inGame = true;
        playerTurn = true;
    }
}