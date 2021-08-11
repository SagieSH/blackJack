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
        initializeMappings();
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value > 0);
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        
        tokenContract.addAmount(msg.sender, _numberOfTokens);

        emit BalanceOf(msg.sender, tokenContract.balanceOf(msg.sender));
    }

    function withdraw(uint256 _numberOfTokens) public {
        require(_numberOfTokens > 0);
        require(tokenContract.balanceOf(msg.sender) >= _numberOfTokens);

        msg.sender.transfer(_numberOfTokens * tokenPrice);

        tokenContract.deductAmount(msg.sender, _numberOfTokens);

        emit BalanceOf(msg.sender, tokenContract.balanceOf(msg.sender));
    }


    //-------------------------------- Game Logic ----------------------------------------------

    string[4] suits = ["\u2660", "\u2662", "\u2667", "\u2665"];
    string[13] values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    mapping(string => uint) valuesToNumbers;
    mapping(string => uint) userToIndex;

    function initializeMappings() public {

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
    
    function getDeck() {

        uint index = 0;

        for(uint i = 0; i < suits.length; i++)
        {
            for(uint x = 0; x < values.length; x++)
            {
                card = Card(values[i], suits[x]);
                deck[index] = card;
                index++;
            }
        }
        indexInDeck = 0;
    }

    
    function random() private view returns (uint) {
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)));
        // convert hash to integer
        // players is an array of entrants
        
    }

    function shuffle() {
        for (uint i = 0; i < 1000; i++) {
            Card location1 = random() % deck.length;
            Card location2 = random() % deck.length;
            Card tmp = deck[location1];

            deck[location1] = deck[location2];
            deck[location2] = tmp;
        }
    }

}