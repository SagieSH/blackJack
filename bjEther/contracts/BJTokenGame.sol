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

    string suits[4] = ["\u2660", "\u2662", "\u2667", "\u2665"];
    string values[13] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    mapping(string => uint) valuesToNumbers;
    mapping(string => uint) userToIndex;

    function initializeMappings() {

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

    mapping(string => string) deck[52];


    // let deck = new Array();
    // let playerTurn = false;     // indicates whether the player can hit or stand
    // let inGame = false;         // indicates whether the player is currently in game
    // let BUSTLIMIT = 22;
    // let DEALLIMIT = 17;

    // let indexInTable;
    // let amount;
    // let countAces;
    // let balance;


}