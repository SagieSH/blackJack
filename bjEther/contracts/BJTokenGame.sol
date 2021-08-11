pragma solidity ^0.5.0;

import "./BJToken.sol";

contract BJTokenGame {
    address admin;
    BJToken public tokenContract;
    uint256 public tokenPrice;

    event Sell(address _buyer, uint256 _amount);

    constructor (BJToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // function multiply(uint x, uint y) internal pure returns (uint z) {
    //     require(y == 0 || (z = x * y) / y == x);
    // }

    function buyTokens() public payable {
        require(msg.value > 0);
        
        tokenContract.mint(msg.sender, msg.value);


        emit Sell(msg.sender, msg.value);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.getBalance(address(this))));

        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        // admin.transfer(address(this).balance);
    }

    function balanceOf(address account) public returns (uint256 balance) {
        return tokenContract.getBalance(account);
    }
}