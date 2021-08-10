pragma solidity ^0.5.0;

contract Token {

	string public constant name = "bjToken";
	string public constant symbol = "BJ";
	string public constant decimal = 0;

	mapping(address => uint256) balances;
	mapping(address => mapping (address => uint256)) allowed;
}